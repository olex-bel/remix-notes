import { useRef } from "react";
import { useNoteFetcher } from "./useNoteFetcher";

export const useNoteUpdateActions = (noteId: number) => {
    const { fetcher, isSubbmited} = useNoteFetcher(noteId);
    const keyUpTimer = useRef<NodeJS.Timeout | null>(null);

    const updatePosition = (newPosition: { x: number, y: number }) => {
        const formData = new FormData();
        formData.append("x", newPosition.x.toString());
        formData.append("y", newPosition.y.toString());
        formData.append("_action", "update_position");
        fetcher.submit(formData, { method: "POST", action: `notes/${noteId}` });
    };

    const updateBodyContent = (bodyContent: string) => {
        if (keyUpTimer.current) {
            clearTimeout(keyUpTimer.current);
        }

        keyUpTimer.current = setTimeout(() => {
            const formData = new FormData();
            formData.append("body", JSON.stringify(bodyContent));
            formData.append("_action", "update_body");
            fetcher.submit(formData, { method: "POST", action: `notes/${noteId}` });
        }, 2000);
    };

    return {
        updatePosition,
        updateBodyContent,
        isSubbmited,
    };
};
