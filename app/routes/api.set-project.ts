import type {ActionFunction} from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const project_id = formData.get("project_id");
    if (!project_id) {
        return new Response("No project_id provided", { status: 400 });
    }
    return new Response(null, {
        status: 200,
        headers: {
            "Set-Cookie": `current_project=${project_id}; SameSite=Strict; Path=/; HttpOnly`,
        },
    });
};