
import { useContext } from "react";
import { NotesContext } from "~/providers/NotesContext";
import { useNoteFetcher } from "~/hooks/useNoteFetcher";
import { RiDeleteBin5Line } from "@remixicon/react";
import type { FormEvent } from "react";

type DeleteButtonProps = {
    noteId: number;
};

export function DeleteButton({ noteId }: DeleteButtonProps) {
    const { fetcher, isSubbmited } = useNoteFetcher(noteId);
    const { activeNoteId, setActiveNoteId } = useContext(NotesContext);
    const handleDelete = (event: FormEvent<HTMLFormElement>) => {
        if (activeNoteId === noteId) {
            setActiveNoteId(null);
        }

        fetcher.submit(event.currentTarget);
    };

    return (
        <fetcher.Form method="post" action={`notes/${noteId}`} onSubmit={handleDelete}>
            <button 
                className="flex items-center justify-center bg-gray-400 h-[40px] w-[40px] rounded-full duration-300 hover:h-[45px] hover:w-[45px]"
                name="_action"
                value="delete_note"
                type="submit"
                disabled={isSubbmited}

            >
                <RiDeleteBin5Line />
                <span className="sr-only">Delete the note</span>
            </button>
        </fetcher.Form>
    );
}
