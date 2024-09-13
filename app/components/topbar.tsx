import { UserButton } from "@clerk/remix";
import { Link, redirect, useFetcher } from "@remix-run/react";
import { css } from "styled-system/css";
import SelectBox from "./selectbox";
import { useAtom } from "jotai";
import { currentProjectAtom } from "~/state";
import { LoaderFunction } from "@remix-run/node";
import db from "~/.server/db";
import { user_projects } from "~/.server/schema";
import { getAuth } from "@clerk/remix/ssr.server";
import { eq } from "drizzle-orm";

export const loader: LoaderFunction = async (args) => {
  const { userId } = await getAuth(args);
  // get all the projects that the current user has access to

  if (!userId) {
    return redirect("/sign-in");
  }

  db.select().from(user_projects).where(eq(user_projects.user_id, userId));
};

export default function Topbar() {
  const [currentProject, setCurrentProject] = useAtom(currentProjectAtom);
  const onProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentProject(e.target.value);
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
            options={{ dev: "Dev Project", prod: "prod" }}
            name="current_project"
            value={currentProject}
            onChange={onProjectChange}
          />
        </div>
      </div>

      <UserButton />
    </header>
  );
}
