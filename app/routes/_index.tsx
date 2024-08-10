import { useState } from "react";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import NoteCards from "~/components/NoteCards";
import Controls from "~/components/Controls";
import { NotesContext } from "~/providers/NotesContext";
import type { MetaFunction, ActionFunctionArgs  } from "@remix-run/node";
import { getNotes, getColors, createNote } from "~/db/databases.server";

export const meta: MetaFunction = () => {
    return [
        { title: "Notes Remix App" },
        { name: "description", content: "Manage your notes." },
    ];
};

export const loader = async () => {
    const notes = await getNotes();
    const colors = await getColors();
	return json({ notes, colors });
};

export const action = async ({
    request,
}: ActionFunctionArgs) => {
    if (request.method !== "POST") {
        return json({ error: true, message: "Invalid request method." });
    }

    const formData = await request.formData();
    const x = formData.get("x") as string | null;
    const y = formData.get("y") as string | null;
    const colorId = formData.get("color_id") as string | null;
    if (!x || !y || !colorId) {
        return json({ error: true, message: "Invalid request data." }, { status: 400 });
    }

    const xPos = Number(x);
    const yPos = Number(y);

    if (isNaN(xPos) || isNaN(yPos)) {
        return json({ error: true, message: "Position (x and y) must be valid numbers." }, { status: 400 });
    }

    try {
        await createNote(xPos, yPos, colorId);
        return json({ error: false, message: "Note is created successfully." });
    } catch (error) {
        console.error("Error creating a note:", error);
        return json({ error: true, message: "Failed to create a new note." }, { status: 500 });
    }
};

export default function Index() {
    const [activeNoteId, setActiveNoteId] = useState<number | null>(null)
    const { notes, colors } = useLoaderData<typeof loader>();
    const contextData = {
        colors,
        activeNoteId,
        setActiveNoteId,
    };

    return (
        <NotesContext.Provider value={contextData}>
            <NoteCards notes={notes} />
            <Controls />
        </NotesContext.Provider>
    );
}
