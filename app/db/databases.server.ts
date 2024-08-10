
import { getDatabaseClient } from "~/db/db.server";
import { asyncSingleton } from "~/utils/singleton.server";

export  type Note = {
    id: number;
    body: string;
    color_id: string;
    pos_x: number;
    pos_y: number;
};

export type Color = {
    id: string;
    body: string;
    header: string;
    text: string;
};

export async function getNotes() {
    try {
        const client = await getDatabaseClient();
        const notes = await client.query("SELECT id, body, pos_x, pos_y, color_id from notes ORDER BY updated_on");

        return notes.rows as Note[];
    } catch (e) {
        console.log("Cannot get notes: ", JSON.stringify(e));
    }

    return [];
}

export async function getColors() {
    return asyncSingleton("colors", async () => {
        try {
            const client = await getDatabaseClient();
            const colors = await client.query("SELECT id, body, header, text  from colors");
    
            return colors.rows as Color[];
        } catch (e) {
            console.log("Cannot get colors: ", JSON.stringify(e));
        }
    
        return [];
    });
}

export async function updatePosition(id: number, x: number, y: number) {
    const client = await getDatabaseClient();

    await client.query("UPDATE notes SET pos_x=$2, pos_y=$3 WHERE id=$1", [id, x, y]);
}

export async function updateBody(id: number, newBody: string) {
    const client = await getDatabaseClient();

    await client.query("UPDATE notes SET body=$2 WHERE id=$1", [id, newBody]);
}

export async function updateColor(id: number, colorId: string) {
    const client = await getDatabaseClient();

    await client.query("UPDATE notes SET color_id=$2 WHERE id=$1", [id, colorId]);
}

export async function createNote( x: number, y: number, colorId: string) {
    const client = await getDatabaseClient();

    await client.query("INSERT INTO notes (body, color_id, pos_x, pos_y) VALUES($1, $2, $3, $4)", ["", colorId, x, y]);
}
