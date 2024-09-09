import { SignIn } from "@clerk/remix";
import { css } from "styled-system/css";

export default function SignInPage() {
  return (
    <div className={css({
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      width: "100vw",
      backgroundColor: "#f7f7f7",
    })}>
      <SignIn />
    </div>
  );
}