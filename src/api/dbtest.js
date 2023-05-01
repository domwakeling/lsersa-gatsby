import { connect } from '@planetscale/database';
import fetch from 'node-fetch';

const config = {
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD
}

export default async function handler(req, res) {

    const conn = await connect(config);
    console.log(conn);
    const results = await conn.execute('SELECT * FROM roles');
    console.log(results);
    res.status(200).json(results);
}