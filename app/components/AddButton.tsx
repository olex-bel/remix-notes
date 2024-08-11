
import { useFetcher } from "@remix-run/react";
import { RiAddLargeLine } from "@remixicon/react";

type AddButtonProps = {
    defaultColorId: string;
}

export default function AddButton({ defaultColorId }: AddButtonProps) {
    const fetcher = useFetcher({ key: "add-note" });

    return (
        <fetcher.Form method="post" action="?index">
            <input type="hidden" name="x" value={10} />
            <input type="hidden" name="y" value={10} />
            <input type="hidden" name="color_id" value={defaultColorId} />
            <button 
                className="flex items-center justify-center bg-gray-400 h-[40px] w-[40px] rounded-full duration-300 hover:h-[45px] hover:w-[45px]"
                type="submit"
                disabled={fetcher.state === "submitting"}
            >
                <RiAddLargeLine />
                <span className="sr-only">Add a new note</span>
            </button>
        </fetcher.Form>
    );
}
