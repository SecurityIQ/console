import { getAuth } from "@clerk/remix/ssr.server";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, redirect, useActionData, useLoaderData, useNavigate, useRevalidator } from "@remix-run/react";
import { withZod } from "@rvf/zod";
import { and, eq, inArray } from "drizzle-orm";
import { useEffect, useState } from "react";
import { GraphData, LinkObject, NodeObject } from "react-force-graph-2d";
import { toast } from "sonner";
import { css } from "styled-system/css";
import { set, z } from "zod";
import { getCookie } from "~/.server/cookie";
import { db } from "~/.server/db";
import { analysis_workspaces, indicators, iocs as iocs_per_ws, projects, user_projects } from "~/.server/schema";
import Button from "~/components/button";
import Graph2D from "~/components/graph2d";
import IndicatorTable from "~/components/indicator-table";
import SelectBox from "~/components/selectbox";
import Textbox from "~/components/textbox";
import { useSelectedAnalysisWorkspace } from "~/hooks/use-selected-analysis-project";
import { addIOC } from "~/utils/analysis";

// construct the following format when the data is ready

/* const graphData = {
    nodes: [
        { id: 'IP1', group: 1 },
        { id: 'Domain1', group: 2 },
        { id: 'Hash1', group: 3 },
        { id: 'IP2', group: 1 },
   ],
    links: [
        { source: 'IP1', target: 'Domain1', value: 3 },
        { source: 'Domain1', target: 'Hash1', value: 5 },
        { source: 'IP2', target: 'Domain1', value: 1 },
    ]
} */

export const loader = async (args: LoaderFunctionArgs) => {
  const { userId } = await getAuth(args);

  if (!userId) {
    return redirect("/sign-in");
  }

  // load all project workspaces
  const cookies = getCookie(args.request)
  let selectedProjectId = cookies.get('current_project')


  const projectQuery = await db
    .select({
      project_id: projects.id,
      project_name: projects.name
    })
    .from(projects)
    .innerJoin(user_projects, eq(user_projects.project_id, projects.id))
    .where(and(eq(user_projects.user_id, userId), selectedProjectId
      ? eq(projects.id, selectedProjectId)
      : undefined
    ))
    .limit(1);

  if (projectQuery.length === 0) {
    return redirect("/dashboard");
  }

  // set the selectedprojectid to the first project in the list if it is not set
  if (!selectedProjectId) {
    selectedProjectId = projectQuery[0].project_id;
  }

  const selectedProject = projectQuery[0]; // the first one is either the selected one or the first one in the list

  // Fetch all the workspaces for the selected project (fetch all so we can display the list of workspaces as menu)
  const workspaces = await db
    .select({
      workspace_id: analysis_workspaces.id,
      workspace_name: analysis_workspaces.name
    })
    .from(analysis_workspaces)
    .where(eq(analysis_workspaces.project_id, selectedProject.project_id));

  const workspaces_dict: Record<string, string> = Object.fromEntries(
    workspaces.map((workspace) => [workspace.workspace_id, workspace.workspace_name])
  );

  // Load the currently selected workspace
  const selectedWorkspaceId = cookies.get('current_analysis_workspace');
  let selectedWorkspace = workspaces.find(workspace => workspace.workspace_id === selectedWorkspaceId) || workspaces[0];

  // Check if the selected workspace belongs to the current project
  if (!workspaces.some(workspace => workspace.workspace_id === selectedWorkspace.workspace_id)) {
    selectedWorkspace = workspaces[0]; // Default to the first workspace if the selected one is not valid
  }

  // get all iocs from the selected workspace with its type
  const wsIOCs: { id: string, indicator: string, type: string }[] = await db.select({ id: iocs_per_ws.id, indicator: iocs_per_ws.indicator, type: indicators.type }).from(iocs_per_ws).where(eq(iocs_per_ws.analysis_workspace_id, selectedWorkspace.workspace_id)).innerJoin(indicators, eq(indicators.indicator, iocs_per_ws.indicator));

  // pull all the indicators for the selected workspace
  return { available_workspaces: workspaces_dict, selected_workspace: selectedWorkspace, iocs: wsIOCs };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const actionType = formData.get("action");
  const cookies = getCookie(request)
  const selectedAnalysisWorkspaceId = cookies.get('current_analysis_workspace')

  switch (actionType) {
    case "addIOC":
      return await addIOC(formData, selectedAnalysisWorkspaceId ? selectedAnalysisWorkspaceId : "");
    default:
      return { errors: { error: true, type: "", value: "" }, indicator: { value: "", type: "" } };
  };
}

export default function IOCAnalysis() {
  const actionData = useActionData<typeof action>();
  const loaderData = useLoaderData<typeof loader>()

  const [graphData, setGraphData] = useState<GraphData>({
    nodes: [],
    links: [],
  });
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [formAction, setFormAction] = useState<string>("");

  const [iocType, setIocType] = useState<string>("");
  const { selectedAnalysisWorkspaceId, setSelectedAnalysisWorkspace } = useSelectedAnalysisWorkspace();

  useEffect(() => {
    // fetch the initial data from the selected workspace according to the cookie
    if (loaderData.selected_workspace) {
      setSelectedAnalysisWorkspace(loaderData.selected_workspace.workspace_id)
    }
  }, [])

  const handleWorkspaceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAnalysisWorkspace(e.target.value);
  }

  useEffect(() => {
    if (loaderData.iocs) {
      setGraphData({
        nodes: loaderData.iocs.map((ioc) => {
          return {
            id: ioc.indicator,
            group: 1,
          }
        }),
        links: [],
      })

      setIndicators(loaderData.iocs.map((ioc) => {
        return {
          value: ioc.indicator,
          type: ioc.type as "ip" | "domain" | "hash" | "url",
        }
      }))

    }

  }, [loaderData])

  useEffect(() => {
    if (actionData) {
      switch (formAction) {
        case "addIOC": {
          if (actionData?.errors.type !== "") {
            toast(actionData?.errors.type);
          }
          if (actionData?.errors.value !== "") {
            toast(actionData?.errors.value);
          }

          if (!actionData?.errors.error) {
            if (actionData?.indicator.value && actionData?.indicator.type) {
              const indicator = actionData.indicator as Indicator;

              setIndicators((prevIndicators) => [
                ...prevIndicators,
                indicator,
              ]);
            }
          }
          break
        }
        default: {
          break
        }
      }
    }
  }, [actionData]);

  const addNode = (newNode: NodeObject) => {
    setGraphData((prevData) => ({
      ...prevData,
      nodes: [...prevData.nodes, newNode], // Add new node
    }));
  };

  const addLink = (newLink: LinkObject) => {
    setGraphData((prevData) => ({
      ...prevData,
      links: [...prevData.links, newLink], // Add new link
    }));
  };

  return (
    <div
      className={css({
        display: "flex",
        height: "full",
        maxWidth: "100%",
      })}
    >
      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          width: "50%",
          maxWidth: "50%",
        })}
      >
        <div
          className={css({
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "black",
            rounded: "xl",
            height: "full",
            overflow: "hidden",
          })}
        >
          {/* only render Graph2D when graphData nodes is not empty, otherwise show "No data panel" */}
          {graphData.nodes.length > 0 ? (
            <Graph2D data={graphData} />
          ) : (
            <div>No Data</div>
          )}
        </div>
        <div
          className={css({
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            bgColor: "primary",
            rounded: "xl",
            height: "full",
          })}
        >
          <span>No Data</span>
        </div>
      </div>
      <div
        className={css({
          paddingX: "24px",
          width: "50%",
        })}
      >
        <div
          className={css({
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          })}
        >
          <h2
            className={css({
              marginBottom: "0",
            })}
          >
            IoCs Analysis
          </h2>
          <SelectBox
            name="workspace"
            value={selectedAnalysisWorkspaceId}
            options={loaderData.available_workspaces}
            onChange={handleWorkspaceChange}
          />
        </div>
        <Form
          className={css({
            display: "flex",
            gap: "8px",
            marginBottom: "24px",
          })}
          onSubmit={() => setFormAction("addIOC")}
          method="post"
        >
          <input type="hidden" name="action" value="addIOC" />
          <Textbox
            name="indicator"
            placeholder="Enter IP, File Hash, Domain, or URL"
          />
          <SelectBox
            name="type"
            options={{
              ip: "IP Address",
              hash: "File Hash",
              domain: "Domain",
              url: "URL",
            }}
            onChange={(e) => setIocType(e.target.value)}
            value={iocType}
          />
          <Button value="Add" />
        </Form>
        <IndicatorTable indicators={indicators} />
      </div>
    </div>
  );
}
