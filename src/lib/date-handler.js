import addHours from 'date-fns/addHours';

const convertDateObject = (dateObj) => {
    let tempDate = dateObj;
    if (tempDate.getUTCHours() > 12) {
        /* if it's before midday UTC we probably have the right date ... otherwise move to midnight
           and get the next day */
        tempDate = addHours(tempDate, 24 - tempDate.getUTCHours());
    }
    return tempDate.toISOString().split("T")[0];
}

const safeDateConversion = (date) => {
    // take a date and **ensure** it generates dateString yyyy-mm-dd
    try {
    
        if (typeof date === typeof {}) {
            // we have a date object
            const tempStr = convertDateObject(date);
            return tempStr;
        }

        if (typeof date !== typeof '') {
            // not an object and not a string = trouble, send error
            throw new Error('Parameter is not an object or string');
        }

        // assume this is a valid string
        if (/\d{4}-\d{2}-\d{2}/.test(date)) {
            // already a valid date string
            return date;
        }

        if (/Z/.test(date)) {
            // includes Z so can turn this into a date
            const dateObj = new Date(date);
            const tempStr = convertDateObject(dateObj);
            return tempStr;
        }

        // is a string, not a simple string, doesn't include Z ...
        throw new Error('Parameter is not recognisably a date');

    } catch (error) {
        throw new Error(error.message);
    }
}

export {
    safeDateConversion
}