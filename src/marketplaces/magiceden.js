import { readFile } from 'fs/promises';
import * as utils from "../utils.js";
import * as math from "../math.js";

const getMagicEdenArithmeticAverage = async () => {
    const yearBasisObject = utils.default.buildYearBasis();

    const magiceden = JSON.parse(await readFile(new URL('./metadata/magiceden.json', import.meta.url)));
    
    const getDate = (date) => new Date(date).toISOString()
    
    const getCollectionByMonth = (startDate, endDate) =>
                                    magiceden.collections.filter(x => x.createdAt >= getDate(startDate) &&
                                    x.createdAt <= getDate(endDate));
    
    yearBasisObject.forEach(monthElement => {
        const monthListedCollections = getCollectionByMonth(monthElement.startDate, monthElement.endDate)
        monthElement.count = monthListedCollections?.length
    });
    
    console.log("Cantidad de colecciones lanzadas por mes en Magic Eden.");
    const tableData = yearBasisObject.map((monthElement) => {
        return { 
            Fecha: monthElement.date,
            Colecciones: monthElement.count
        }
    })
    console.table(tableData);

    const months = tableData.map(x => x.Fecha).reverse();
    const collections = tableData.map(x => x.Colecciones).reverse();
    const magicEdenArithmeticAverage = math.default.calculateArithmeticAverage(collections);

    console.log(`Media aritmetica de lanzamiento de colecciones: ${magicEdenArithmeticAverage}.`);

    utils.default.exportToCsv(months, [collections], "magic_eden.xlsx");

    return magicEdenArithmeticAverage;
}

export default getMagicEdenArithmeticAverage;