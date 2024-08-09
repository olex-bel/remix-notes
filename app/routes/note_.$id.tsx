
import { json } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import { updatePosition, updateBody } from "~/db/databases.server";

export const action = async ({
    request,
    params,
}: ActionFunctionArgs) => {

    if (!params.id) {
        throw new Response("Missing Id param", {
            status: 500,
        });
    }

    if (request.method !== "POST") {
        return json({ error: true, message: "Invalid request method." });
    }

    const formData = await request.formData();
    const actionType = formData.get("_action") as string;

    switch (actionType) {
        case "update_position": {
            const position = formData.get("position") as string | null;
            if (!position) {
                return json({ error: true, message: "Position' is required." }, { status: 400 });
            }

            try {
                await updatePosition(+params.id, position);
                return json({ error: false, message: "Position updated successfully." });
            } catch (error) {
                console.error("Error updating position:", error);
                return json({ error: true, message: "Failed to update position." }, { status: 500 });
            }
        }

        case "update_body": {
            const body = formData.get("body") as string | null;
            if (!body) {
                return json({ error: true, message: "Body is required." }, { status: 400 });
            }

            try {
                await updateBody(+params.id, body);
                return json({ error: false, message: "Body content updated successfully." });
            } catch (error) {
                console.error("Error updating body:", error);
                return json({ error: true, message: "Failed to update body content." }, { status: 500 });
            }
        }

        default:
            return json({ error: true, message: `Error: Invalid action '${actionType}' provided.` }, { status: 400 });
    }
};
