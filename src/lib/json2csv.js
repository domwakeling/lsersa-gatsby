const json2csv = (data) => {

    const csvRows = [];
    const headers = Object.keys(data[0]).sort((a, b) => a > b ? 1 : -1);
    csvRows.push(headers.join(","));

    for (let i = 0; i < data.length; i++) {
        const csvRow = [];
        for (let j = 0; j < headers.length; j++) {
            csvRow.push(data[i][headers[j]]);
        }
        csvRows.push(csvRow.join(","))
    }

    return csvRows.join("\n");
}

export {
    json2csv
}