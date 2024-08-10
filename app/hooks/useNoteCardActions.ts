import { useRef } from "react";
import { useFetcher } from "@remix-run/react";

export const useNoteCardActions = (noteId: number) => {
    const fetcher = useFetcher({ key: `card-${noteId}` });
    const keyUpTimer = useRef<NodeJS.Timeout | null>(null);

    const updatePosition = (newPosition: { x: number, y: number }) => {
        const formData = new FormData();
        formData.append("x", newPosition.x.toString());
        formData.append("y", newPosition.y.toString());
        formData.append("_action", "update_position");
        fetcher.submit(formData, { method: "POST", action: `note/${noteId}` });
    };

    const updateBodyContent = (bodyContent: string) => {
        if (keyUpTimer.current) {
            clearTimeout(keyUpTimer.current);
        }

        keyUpTimer.current = setTimeout(() => {
            const formData = new FormData();
            formData.append("body", JSON.stringify(bodyContent));
            formData.append("_action", "update_body");
            fetcher.submit(formData, { method: "POST", action: `note/${noteId}` });
        }, 2000);
    };

    const updateColor = (colorId: string) => {
        const formData = new FormData();
        formData.append("color_id", colorId);
        formData.append("_action", "update_color");
        fetcher.submit(formData, { method: "POST", action: `note/${noteId}` });
    };

    return {
        updatePosition,
        updateBodyContent,
        updateColor,
        isSaving: fetcher.state === "submitting",
    };
};
