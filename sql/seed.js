
import pg from "pg"
import { fakeData } from "../app/db/fake.data.server.js";

async function seed() {
    const { Client } = pg;
    const client = new Client({
        user: '',
        password: '',
        database: 'notes',
    });
    const queryText = 'INSERT INTO notes (body, colors, position) VALUES($1, $2, $3)';

    await client.connect();

    try {
        await client.query('BEGIN');

        fakeData.map(async (item) => {
            await client.query(queryText, [item.body, item.colors, item.position]);
        });
        await client.query('COMMIT');
    } catch (e) {
        await client.query('ROLLBACK')
        throw e
    } finally {
        await client.end()
    }
}

seed();
