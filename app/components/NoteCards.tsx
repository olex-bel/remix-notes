
import NoteCard from "./NoteCard"
import type { Note } from "~/db/fake.data.server"

type NoteCardsProps = {
    notes: Note[];
}

export default function NoteCards({ notes }: NoteCardsProps) {
    return (
        <div>
            {notes.map((note) => (
                <NoteCard note={note} key={note.id} />
            ))}
        </div>
    )
}
