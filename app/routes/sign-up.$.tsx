import { getAuth } from "@clerk/remix/ssr.server";
import { LoaderFunction, LoaderFunctionArgs, redirect } from "@remix-run/node";

export const loader: LoaderFunction = async (args: LoaderFunctionArgs) => {
  const { userId } = await getAuth(args);
  if (userId) {
    return redirect("/dashboard");
  }
};

export default function SignUp() {
  return (
    <div>
      <h1>Sign Up</h1>
    </div>
  );
}