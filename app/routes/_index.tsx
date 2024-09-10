import { getAuth } from "@clerk/remix/ssr.server";
import { LoaderFunction, LoaderFunctionArgs, redirect, type MetaFunction } from "@remix-run/node";
import { css } from "styled-system/css";
import Navbar from "~/components/topbar";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader: LoaderFunction = async (args) => {
  const auth = await getAuth(args);
  console.log(auth.userId)
  if (!auth.userId) {
    return redirect("/sign-in");
  }
  return redirect("/dashboard");
};

export default function Index() {
 return <></>;
}
