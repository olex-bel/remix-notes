import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import NoteCards from "~/components/NoteCards";
import type { MetaFunction  } from "@remix-run/node";
import { getNotes } from "~/db/databases.server";

export const meta: MetaFunction = () => {
    return [
        { title: "Notes Remix App" },
        { name: "description", content: "Manage your notes." },
    ];
};

export const loader = async () => {
    const notes = await getNotes();
	return json({ notes: notes });
};

export default function Index() {
    const { notes } = useLoaderData<typeof loader>();

    return (
        <NoteCards notes={notes} />
    );
}
