import fs from "fs";
import { stringify } from "csv-stringify";

const buildYearBasis = () => {
    const yearBasisObject = [{ date: 'Agosto 2022' }, { date: 'Julio 2022' }, { date: 'Junio 2022' },
        { date: 'Mayo 2022' }, { date: 'Abril 2022' }, { date: 'Marzo 2022' }, { date: 'Febrero 2022' },
        { date: 'Enero 2022' }, { date: 'Diciembre 2021' }, { date: 'Noviembre 2021' },
        { date: 'Octubre 2021' }, { date: 'Septiembre 2021' }
    ]

    const date = new Date('2022-09-01');

    for (let index = 0; index < yearBasisObject.length; index++) {
        const monthMetadata = yearBasisObject[index];
        
        const indexToGetPreviousMonth = -(index);
        monthMetadata.startDate = new Date(Date.UTC(date.getFullYear(), date.getMonth() + indexToGetPreviousMonth, 1, 0, 0, 0)).toISOString();
        monthMetadata.endDate = new Date(Date.UTC(date.getFullYear(), date.getMonth() + indexToGetPreviousMonth + 1, 0, 23, 59, 59)).toISOString();
    }

    return yearBasisObject;
}

const exportToCsv = (columns, rows, filename = "saved_from_db.csv") => {
    const writableStream = fs.createWriteStream(`./csv/${filename}`);
    const stringifier = stringify({ header: true, columns: columns });

    rows.forEach(row => {
        stringifier.write(row);
    });

    stringifier.pipe(writableStream);
    console.log(`Archivo creado ${filename}.`);
  }

export default { buildYearBasis, exportToCsv };