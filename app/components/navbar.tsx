import { UserButton, UserProfile } from "@clerk/remix";
import { Link } from "@remix-run/react";
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
        <Link
          className={css({
            fontSize: 20,
            fontWeight: "bold",
          })}
          to='/dashboard'
        >
          SecurityIQ Console
        </Link>
        <UserButton />
      </div>
    </nav>
  );
}
