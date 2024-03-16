import sql from '../../lib/db';

const insertNewRacer = async (user_id, new_racer, verified=false) => {

    // set up the keys and values to insert
    new_racer.verified = verified;
    const racerKeys = Object.keys(new_racer);

    let idx = racerKeys.indexOf('dob');
    if (idx >= 0 && new_racer['dob']) {
        const newDob = new_racer['dob'].split("T")[0];
        console.log(newDob);
        new_racer['dob'] = newDob;
    }

    idx = racerKeys.indexOf('club_expiry');
    if (idx >= 0 && new_racer['club_expiry']) {
        const newExpiry = new_racer['club_expiry'].split("T")[0];
        console.log(newExpiry);
        new_racer['club_expiry'] = newExpiry;
    }

    // db
    const results = await sql.begin(async sql => {

        const tryInsertRacer = await sql`
            INSERT INTO racers ${
                sql(new_racer, racerKeys)
                }
            RETURNING *
        `;

        const newRacerId = tryInsertRacer[0].id;
        const tryInsertUserRacer = await sql`
            INSERT INTO users_racers (
                user_id,
                racer_id
            )
            VALUES (
                ${user_id},
                ${newRacerId}
            )
            RETURNING *
        `;

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