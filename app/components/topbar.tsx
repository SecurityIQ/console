import { UserButton, UserProfile } from "@clerk/remix";
import { Link } from "@remix-run/react";
import { css } from "styled-system/css";

export default function Topbar() {
  return (
    <header className={css({
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    })}>
      <Link
        className={css({
          fontSize: 24,
          fontWeight: "bold",
        })}
        to='/dashboard'
      >
        SecurityIQ Console
      </Link>
      <UserButton />
    </header>
  );
}
