
import { json } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import { updatePosition, updateBody, updateColor, deleteNote } from "~/model/notes.server";
import { validateFormData, ValidationFormDataError } from "~/utils/vlidation.server";

export const action = async ({
    request,
    params,
}: ActionFunctionArgs) => {

    if (!params.id) {
        throw new Response("Missing Id param", {
            status: 500,
        });
    }

    const id = Number(params.id);

    if (request.method !== "POST") {
        return json({ error: true, message: "Invalid request method." });
    }

    const formData = await request.formData();
    const actionType = formData.get("_action") as string;

    try {
        switch (actionType) {
            case "update_position": {
                const { x, y } = validateFormData<{x: number, y: number}>(formData, {
                    x: { required: true, type: 'number' },
                    y: { required: true, type: 'number' },
                });

                await updatePosition(id, x, y);
                return json({ error: false, message: "Position updated successfully." });
            }

            case "update_body": {
                const { body } = validateFormData<{body: string}>(formData, {
                    body: { required: true, type: 'string' },
                });

                await updateBody(id, body);
                return json({ error: false, message: "Body content updated successfully." });                
            }

            case "update_color": {
                const { color_id } = validateFormData<{ color_id: string }>(formData, {
                    color_id: { required: true, type: 'string' },
                });
                
                await updateColor(id, color_id);
                return json({ error: false, message: "Color updated successfully." });
            }

            case "delete_note": {
                await deleteNote(id);
                return json({ error: false, message: "Note deleted successfully." });
            }

            default:
                return json({ error: true, message: `Error: Invalid action '${actionType}' provided.` }, { status: 400 });
        }
    } catch (error) {
        console.error("Error handling request:", error);

        if (error instanceof ValidationFormDataError) {
            return json({ error: true, message: error.message }, { status: error.status });
        }

        return json({ error: true, message: "Internal server error" }, { status: 500 });
    }
};
