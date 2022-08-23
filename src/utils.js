import fs from "fs";
import { stringify } from "csv-stringify";

const buildYearBasis = () => {
    const yearBasisObject = [];

    const monthNames = new Array("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre");
    const date = new Date();
    date.setDate(1);

    for (let index = 0; index <= 11; index++) {
        yearBasisObject.push({ date: monthNames[date.getMonth()] + ' ' + date.getFullYear() })
        date.setMonth(date.getMonth() - 1);
    }

    const now = new Date();

    for (let index = 0; index < yearBasisObject.length; index++) {
        const monthMetadata = yearBasisObject[index];
        
        const indexToGetPreviousMonth = -(index);
        monthMetadata.startDate = new Date(Date.UTC(now.getFullYear(), now.getMonth() + indexToGetPreviousMonth, 1, 0, 0, 0)).toISOString();
        monthMetadata.endDate = new Date(Date.UTC(now.getFullYear(), now.getMonth() + indexToGetPreviousMonth + 1, 0, 23, 59, 59)).toISOString();
    }

    return yearBasisObject;
}

const exportToCsv = (columns, rows, filename = "results.xls") => {
    const folderName = './csv';
    if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName);
    }

    const writableStream = fs.createWriteStream(`${folderName}/${filename}`);
    const stringifier = stringify({ header: true, columns: columns });

    rows.forEach(row => {
        stringifier.write(row);
    });

    stringifier.pipe(writableStream);
    console.log(`Archivo creado ${filename}.\n`);
}

export { buildYearBasis, exportToCsv };