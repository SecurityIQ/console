import { UserProfile } from "@clerk/remix";
import { css } from "styled-system/css";

export default function Navbar() {
  return (
    <nav>
      <div
        className={css({
          maxWidth: "1280px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          marginX: "auto",
          p: 6,
        })}
      >
        <span
          className={css({
            fontSize: "24px",
            fontWeight: "bold",
          })}
        >
          SecurityIQ Console
        </span>
        <UserProfile />
      </div>
    </nav>
  );
}
