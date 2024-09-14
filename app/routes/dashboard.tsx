import { Outlet, redirect, useLoaderData } from "@remix-run/react";
import Topbar from "~/components/topbar";
import Navbar from "~/components/navbar";
import { css } from "styled-system/css";
import { Toaster } from "sonner";
import { LoaderFunction } from "@remix-run/node";
import { getAuth } from "@clerk/remix/ssr.server";
import { projects, user_projects } from "~/.server/schema";
import { eq, inArray } from "drizzle-orm";
import { db } from "~/.server/db";

export const loader: LoaderFunction = async (args) => {
  const { userId } = await getAuth(args);
  if (!userId) {
    return redirect("/sign-in");
  }

  const available_projects_id_raw = await db.select({ project_id: user_projects.project_id }).from(user_projects).where(eq(user_projects.user_id, userId));
  let available_projects_id: string[] = [];
  // fetch all the projects that the current user has access to
  available_projects_id_raw.map((project) => {
    if (project.project_id)
      available_projects_id.push(project.project_id)
  });
  const available_projects = await db.select({project_id: projects.id, project_name: projects.name}).from(projects).where(inArray(projects.id, available_projects_id)); // get all available projects

  const available_projects_dict: Record<string, string> = {};
  available_projects.map((project) => {
    available_projects_dict[project.project_id] = project.project_name;
  });

  console.log(available_projects_id)
  return { available_projects_dict };
}

export default function Layout() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className={css({
      display: "flex",
      minHeight: "100vh",
      padding: "24px",
    })}>
      <Toaster />
      <Navbar />
      <main className={css({
        flexGrow: 1,
        marginLeft: "104px",
        margin: "0 auto",
        paddingLeft: '104px',
        paddingBottom: '4rem',
      })}>
        <Topbar available_projects={data.available_projects_dict} />
        <div className={css({
          paddingTop: '24px',
          display: 'flex',
          height: 'full',
          flexDirection: 'column',
        })}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}