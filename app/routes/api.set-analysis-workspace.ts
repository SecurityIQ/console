
import type {ActionFunction} from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const analysis_workspace_id = formData.get("analysis_workspace_id");
    if (!analysis_workspace_id) {
        return new Response("No analysis_workspace_id provided", { status: 400 });
    }
    return new Response(null, {
        status: 200,
        headers: {
            "Set-Cookie": `current_analysis_workspace=${analysis_workspace_id}; SameSite=Strict; Path=/; HttpOnly`,
        },
    });
};