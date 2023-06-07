import { fetch } from 'undici';
import { connect } from '@planetscale/database';

const config = {
    fetch,
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD
}

const insertNewRacer = async (user_id, new_racer, verified=false) => {

    // set up the keys and values to insert
    const racerKeys = Object.keys(new_racer);
    const racerValues = racerKeys.map(key => new_racer[key]);
    racerKeys.push('verified');
    racerValues.push(verified);

    let idx = racerKeys.indexOf('dob');
    if (idx >= 0 && racerValues[idx]) {
        const newDob = racerValues[idx].split("T")[0];
        console.log(newDob);
        racerValues[idx] = newDob;
    }
    idx = racerKeys.indexOf('club_expiry');
    if (idx >= 0 && racerValues[idx]) {
        const newExpiry = racerValues[idx].split("T")[0];
        console.log(newExpiry);
        racerValues[idx] = newExpiry;
    }

    // get the strings for INSERT
    const insertStringCols = racerKeys.join(",");
    const insertStringValues = racerKeys.map(key => '?').join(",");

    // db
    const conn = await connect(config);
    const results = await conn.transaction(async (tx) => {

        const tryInsertRacer = await tx.execute(`
                INSERT INTO racers (${insertStringCols}) VALUES (${insertStringValues})
            `,
            racerValues
        );

        const newRacerId = tryInsertRacer.insertId;
        const tryInsertUserRacer = await tx.execute(`
                INSERT INTO users_racers (user_id, racer_id) VALUES (${user_id}, ${newRacerId})
            `,
            racerValues
        );

        return [
            tryInsertRacer,
            tryInsertUserRacer,
            newRacerId
        ]
    });

    return results;
}

export {
    insertNewRacer
}