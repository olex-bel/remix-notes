
import { useNoteFetcher } from "~/hooks/useNoteFetcher";
import type { Color } from "~/model/notes.server";

type ColorOptionProps = {
    noteId: number;
    color: Color;
}

export default function ColorOption({ noteId, color }: ColorOptionProps) {
    const { fetcher } = useNoteFetcher(noteId);

    return (
        <fetcher.Form method="post" action={`notes/${noteId}`}>
            <input type="hidden" name="color_id" value={color.id} />
            <button
                className="bg-slate-200 w-[40px] h-[40px] duration-300 rounded-full hover:h-[45px] hover:w-[45px]"
                name="_action"
                value="update_color"
                style={{ backgroundColor: color.header }}
            >
                <span className="sr-only">Select color code {color.header}</span>
            </button>
        </fetcher.Form>
    );
}
