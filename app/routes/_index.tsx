import { useState, useEffect } from "react";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import NoteCards from "~/components/NoteCards";
import Controls from "~/components/Controls";
import { NotesContext } from "~/providers/NotesContext";
import type { MetaFunction, ActionFunctionArgs  } from "@remix-run/node";
import { getNotes, getColors, createNote } from "~/model/notes.server";
import { validateFormData } from "~/utils/vlidation.server";

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

    try {
        const {x, y, color_id} = validateFormData<{x: number, y: number, color_id: string}>(formData, {
            x: { required: true, type: 'number' },
            y: { required: true, type: 'number' },
            color_id: { required: true, type: 'string' },
        });
        await createNote(x, y, color_id);
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
