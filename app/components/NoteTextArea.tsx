
import { useRef, useEffect } from "react";
import { autoGrow } from "~/utils/cartUtils";

type NoteTextAreaProps = {
    body: string;
    colorText?: string;
    onTextChanged: (text: string) => void;
}

export default function NoteTextArea({ body, colorText, onTextChanged }: NoteTextAreaProps) {
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const handleInput = () => {
        if (textAreaRef.current) {
            autoGrow(textAreaRef.current);
        }
    };
    const handleKeyUp = async () => {
        if (textAreaRef.current) {
            onTextChanged(textAreaRef.current.value);
        }
    };

    useEffect(() => {
        if (textAreaRef.current) {
            autoGrow(textAreaRef.current);
        }
    }, [])

    return (
        <textarea
            ref={textAreaRef}
            className="bg-inherit border-none w-full h-full resize-none text-base focus:outline-none"
            style={{ color: colorText }}
            defaultValue={body}
            onInput={handleInput}
            onKeyUp={handleKeyUp}
        />
    )
}
