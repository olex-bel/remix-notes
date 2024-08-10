
import { useNoteCardActions } from "~/hooks/useNoteCardActions";
import type { Color } from "~/db/databases.server";

type ColorOptionProps = {
    noteId: number;
    color: Color;
}

export default function ColorOption({ noteId, color }: ColorOptionProps) {
    const { updateColor } = useNoteCardActions(noteId);
    const chanegColor = async () => {
        updateColor(color.id);
    }

    return (
        <button
            onClick={chanegColor}
            className="bg-slate-200 w-[40px] h-[40px] duration-300 rounded-full hover:h-[45px] hover:w-[45px]"
            style={{ backgroundColor: color.header }}
        >
            <span className="sr-only">Select color code {color.header}</span>
        </button>
    );
}
