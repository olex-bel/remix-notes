import { createContext } from "react";
import type { Color } from "~/model/notes.server";

type NotesContextType = {
    activeNoteId: number | null;
    colors: Color[];
    setActiveNoteId: (id: number | null) => void;
};

export const NotesContext = createContext<NotesContextType>({
    activeNoteId: null,
    colors: [],
    setActiveNoteId: (_: number | null) => {},
});

export function converColorsToMap(colors: Color[]) {
    const colorMap = new Map<string, Color>();
    colors.forEach(color => {
        colorMap.set(color.id, color);
    });

    return colorMap;
}