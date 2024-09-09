import type { MetaFunction } from "@remix-run/node";
import { css } from "styled-system/css";
import Navbar from "~/components/navbar";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className={css({ h: "full" })}>
      <div
        className={css({
          display: "flex",
          flexDirection: "column",
        })}
      ></div>
    </div>
  );
}
