
import { getDatabaseClient } from "~/db/db.server";

export  type Note = {
    id: number;
    body: string;
    colors: string;
    position: string;
};

export async function getNotes() {
    try {
        const client = await getDatabaseClient();
        const notes = await client.query("SELECT * FROM notes");

        return notes.rows as Note[];
    } catch (e) {
        console.log("Cannot get notes: ", JSON.stringify(e));
    }

    return [];
}

export async function updatePosition(id: number, newPosition: string) {
    const client = await getDatabaseClient();

    await client.query("UPDATE notes SET position=$2 WHERE id=$1", [id, newPosition]);
}

export async function updateBody(id: number, newBody: string) {
    const client = await getDatabaseClient();

    await client.query("UPDATE notes SET body=$2 WHERE id=$1", [id, newBody]);
}
