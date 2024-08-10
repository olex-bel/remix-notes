
import pg from "pg"
import { fakeData } from "./fake.data.server.js";


const { Client } = pg;
const client = new Client({
    user: '',
    password: '',
    database: 'notes',
});
const queryColorsText = 'INSERT INTO colors (id, header, body, text) VALUES($1, $2, $3, $4)';
const queryNotesText = 'INSERT INTO notes (body, color_id, pos_x, pos_y) VALUES($1, $2, $3, $4)';

await client.connect();

try {
    await client.query('BEGIN');

    for (let i = 0; i < fakeData.length; ++i) {
        const item = fakeData[i];
        await client.query(queryColorsText, [item.colors.id, item.colors.colorHeader, item.colors.colorBody, item.colors.colorText]);
        await client.query(queryNotesText, [item.body, item.colors.id, item.position.x, item.position.y]);
    }
    await client.query('COMMIT');
} catch (e) {
    await client.query('ROLLBACK')
    console.log(e)
} finally {
    await client.end()
}

