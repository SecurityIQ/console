import { SignIn } from "@clerk/remix";
import { getAuth } from "@clerk/remix/ssr.server";
import { LoaderFunction, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { css } from "styled-system/css";

export const loader: LoaderFunction = async (args: LoaderFunctionArgs) => {
  const { userId } = await getAuth(args);
  if (userId) {
    return redirect("/dashboard");
  }

  return null
};

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