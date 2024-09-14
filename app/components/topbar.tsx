import { UserButton } from "@clerk/remix";
import { Link, redirect, useFetcher } from "@remix-run/react";
import { css } from "styled-system/css";
import SelectBox from "./selectbox";
import { useAtom } from "jotai";
import { currentProjectAtom } from "~/state";
import { Project } from "~/.server/schema";
import { useEffect } from "react";
import { useSelectedProject } from "~/hooks/use-selected-project";

interface Props {
  available_projects: Record<string, string>;
}

export default function Topbar(props: Props) {
  const {selectedProjectId, setSelectedProject} = useSelectedProject();
  const fetcher = useFetcher()

  useEffect(() => {
    if (selectedProjectId === "") {
      const firstProjectId = Object.keys(props.available_projects)[0];
      setSelectedProject(firstProjectId);
    }
  })

  const onProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProject(e.target.value);
  };

  return (
    <header
      className={css({
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      })}
    >
      <div
        className={css({
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
        })}
      >
        <Link
          className={css({
            fontSize: 24,
            fontWeight: "bold",
          })}
          to="/dashboard"
        >
          SecurityIQ Console
        </Link>
        <div>
          <SelectBox
            options={props.available_projects}
            name="current_project"
            value={selectedProjectId}
            onChange={onProjectChange}
          />
        </div>
      </div>

      <UserButton />
    </header>
  );
}
