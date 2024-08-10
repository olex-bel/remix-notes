
import { useContext } from "react";
import { NotesContext } from "~/providers/NotesContext";
import AddButton from "./AddButton";
import ColorOption from "./ColorOption";

export default function Controls() {
    const { colors, activeNoteId } = useContext(NotesContext);
    const defaultColorId = colors.length > 0? colors[0].id : null;

    return (
        <div className="flex flex-col gap-2 items-center fixed top-1/2 left-4 translate-y-1/2 bg-cyan-900 p-1 rounded-full shadow z-[10000]">
            {defaultColorId && <AddButton  defaultColorId={defaultColorId} />}
            {
                activeNoteId && colors.map((color) => {
                    return (
                        <ColorOption key={color.id} color={color} noteId={activeNoteId} />
                    )
                })
            }
        </div>
    );
}
