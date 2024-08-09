
import { useRef, useEffect, useState } from "react";
import { useFetcher } from "@remix-run/react";
import { RiDeleteBin5Line } from "@remixicon/react";
import { autoGrow, setNewOffset } from "~/utils/cartUtils";
import type { Note } from "~/db/fake.data.server";
import type { MouseEvent as ReactMouseEvent } from "react";

type NoteCardProps = {
    note: Note;
}

export default function NoteCard({ note }: NoteCardProps) {
    const [position, setPositon] = useState(JSON.parse(note.position));
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const fetcher = useFetcher({ key: `card-${note.id}` });
    const keyUpTimer = useRef<NodeJS.Timeout | null>(null);
    const mouseStartPos = { x: 0, y: 0 };
    const colors = JSON.parse(note.colors);
    const body = JSON.parse(note.body);
    const handleInput = () => {
        if (textAreaRef.current) {
            autoGrow(textAreaRef.current);
        }
    };
    const savePosition = (newPosition: { x: number, y: number }) => {
        const formData = new FormData();
        formData.append("position", JSON.stringify(newPosition));
        formData.append("id", note.id + "");
        fetcher.submit(formData, {
            method: "POST",
            action: "?index",
        });
    }
    const handleKeyUp = async () => {
        if (keyUpTimer.current) {
            clearTimeout(keyUpTimer.current);
        }
     
        keyUpTimer.current = setTimeout(() => {
            const formData = new FormData();
            formData.append("body", JSON.stringify(textAreaRef.current.value));
            formData.append("id", note.id + "");
            fetcher.submit(formData, {
                method: "POST",
                action: "?index",
            });
        }, 2000);
    };
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
            savePosition(newPosition);
        }
    };
 
    useEffect(() => {
        if (textAreaRef.current) {
            autoGrow(textAreaRef.current);
        }
    }, [])

    return (
        <div  
            ref={cardRef}
            className="w-96 rounded-md cursor-pointer shadow-sm absolute"
            style={{
                backgroundColor: colors.colorBody,
                left: `${position.x}px`,
                top: `${position.y}px`,
            }}
        >
            <div
                className="flex justify-space items-center p-1.5 rounded-t-sm"
                style={{ backgroundColor: colors.colorHeader }}
                role="button"
                tabIndex={0}
                onMouseDown={handleMouseDown}
            >
                <RiDeleteBin5Line />

                {
                    fetcher.state === "submitting" && (
                        <div className="card-saving">
                            <span style={{ color: colors.colorText }}>Saving...</span>
                        </div>
                    )
                }
            </div>
            <div className="p-1 rounded-b-sm">
                <textarea
                    ref={textAreaRef}
                    className="bg-inherit border-none w-full h-full resize-none text-base focus:outline-none"
                    style={{ color: colors.colorText }}
                    defaultValue={body}
                    onInput={handleInput}
                    onKeyUp={handleKeyUp}
                />
            </div>
        </div>
    );
}
