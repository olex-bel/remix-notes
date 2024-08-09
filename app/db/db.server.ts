
import pg from "pg"
import { asyncSingleton } from "~/utils/singleton.server";

export async function getDatabaseClient() {
    return await asyncSingleton(
        "pg",
        async () => {
            const { Client } = pg;
            const client = new Client();
            await client.connect();
            return client;
        },
    );
}
