import { useFetcher } from "@remix-run/react";

export const useNoteFetcher = (noteId: number) => {
    const fetcher = useFetcher({ key: `card-${noteId}` });

    return {
        fetcher,
        isSubbmited: fetcher.state === "submitting",
    };
};
