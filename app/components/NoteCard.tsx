
import { useRef, useState, useContext } from "react";
import { DeleteButton } from "./DeleteButton";
import { NotesContext } from "~/providers/NotesContext";
import NoteTextArea from "./NoteTextArea";
import { setNewOffset } from "~/utils/cartUtils";
import { useNoteUpdateActions } from "~/hooks/useNoteUpdateActions";
import type { Note } from "~/model/notes.server";
import type { MouseEvent as ReactMouseEvent } from "react";

type NoteCardProps = {
    note: Note;
}

export default function NoteCard({ note }: NoteCardProps) {
    const [position, setPositon] = useState({ x: note.pos_x, y: note.pos_y});
    const cardRef = useRef<HTMLDivElement>(null);
    const { colors, setActiveNoteId } = useContext(NotesContext);
    const { updatePosition, updateBodyContent, isSubbmited } = useNoteUpdateActions(note.id);
    const mouseStartPos = { x: 0, y: 0 };
    const cardColors = colors.find(color => color.id === note.color_id);
    const body = note.body? JSON.parse(note.body) : "";
    const handleMouseDown = (e: ReactMouseEvent) => {
        mouseStartPos.x = e.clientX;
        mouseStartPos.y = e.clientY;
     
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };
    const handleMouseMove = (e: MouseEvent) => {
        if (cardRef.current) {
            const mouseMoveDir = {
                x: mouseStartPos.x - e.clientX,
                y: mouseStartPos.y - e.clientY,
            };
         
            mouseStartPos.x = e.clientX;
            mouseStartPos.y = e.clientY;
            const newPosition = setNewOffset(cardRef.current, mouseMoveDir);
         
            setPositon(newPosition);
        }

    };
    const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);

        if (cardRef.current) {
            const newPosition = setNewOffset(cardRef.current);

            if (note.pos_x !== newPosition.x || note.pos_y !== newPosition.y) {
                updatePosition(newPosition);
            }
        }

        setActiveNoteId(note.id);
    };
    const handleTextChanged = (newBody: string) => updateBodyContent(newBody);

    return (
        <div  
            ref={cardRef}
            className="w-96 rounded-md cursor-pointer shadow-sm absolute"
            style={{
                backgroundColor: cardColors?.body,
                left: `${position.x}px`,
                top: `${position.y}px`,
            }}
        >
            <div
                className="flex justify-space items-center p-1.5 rounded-t-sm"
                style={{ backgroundColor: cardColors?.header }}
                role="button"
                tabIndex={0}
                onMouseDown={handleMouseDown}
            >
                <DeleteButton noteId={note.id} />
                {
                    isSubbmited && (
                        <div className="card-saving">
                            <span style={{ color: cardColors?.text }}>Processing...</span>
                        </div>
                    )
                }
            </div>
            <div className="p-1 rounded-b-sm">
                <NoteTextArea 
                    body={body}
                    colorText={cardColors?.text}
                    onTextChanged={handleTextChanged}
                />
            </div>
        </div>
    );
}
