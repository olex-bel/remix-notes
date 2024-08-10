
import { useRef } from "react";
import { useFetcher } from "@remix-run/react";
import { RiAddLargeLine } from "@remixicon/react";

type AddButtonProps = {
    defaultColorId: string;
}

export default function AddButton({ defaultColorId }: AddButtonProps) {
    const startingPosRef = useRef(10);
    const fetcher = useFetcher({ key: "add-note" });

    const addNote = async () => {
        const formData = new FormData();
        formData.append("x", startingPosRef.current.toString());
        formData.append("y", startingPosRef.current.toString());
        formData.append("color_id", defaultColorId);
        fetcher.submit(formData, { method: "POST", action: "?index" });
    };

    return (
        <button 
            className="flex items-center justify-center bg-gray-400 h-[40px] w-[40px] rounded-full duration-300 hover:h-[45px] hover:w-[45px]"
            onClick={addNote}
            disabled={fetcher.state === "submitting"}
        >
            <RiAddLargeLine />
            <span className="sr-only">Add a new note</span>
        </button>
    );
}
