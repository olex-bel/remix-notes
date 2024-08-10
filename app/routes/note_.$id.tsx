
import { json } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import { updatePosition, updateBody, updateColor } from "~/db/databases.server";

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
            const x = formData.get("x") as string | null;
            const y = formData.get("y") as string | null;
            if (!x || !y) {
                return json({ error: true, message: "Position' is required." }, { status: 400 });
            }

            const xPos = Number(x);
            const yPos = Number(y);

            if (isNaN(xPos) || isNaN(yPos)) {
                return json({ error: true, message: "Position (x and y) must be valid numbers." }, { status: 400 });
            }

            try {
                await updatePosition(+params.id, xPos, yPos);
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

        case "update_color": {
            const colorId = formData.get("color_id") as string | null;
            if (!colorId) {
                return json({ error: true, message: "Color Id is required." }, { status: 400 });
            }

            try {
                await updateColor(+params.id, colorId);
                return json({ error: false, message: "Color updated successfully." });
            } catch (error) {
                console.error("Error updating body:", error);
                return json({ error: true, message: "Failed to update color." }, { status: 500 });
            }
        }

        default:
            return json({ error: true, message: `Error: Invalid action '${actionType}' provided.` }, { status: 400 });
    }
};
