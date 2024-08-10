import { createContext } from "react";
import type { Color } from "~/db/databases.server";

type NotesContextType = {
    activeNoteId: number | null;
    colors: Color[];
    setActiveNoteId: (id: number) => void;
};

export const NotesContext = createContext<NotesContextType>({
    activeNoteId: null,
    colors: [],
    setActiveNoteId: (_: number) => {},
});

export function converColorsToMap(colors: Color[]) {
    const colorMap = new Map<string, Color>();
    colors.forEach(color => {
        colorMap.set(color.id, color);
    });

    return colorMap;
}