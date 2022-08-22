import { readFile } from 'fs/promises';
import * as utils from "../utils.js";

const getMagicEdenStats = async () => {
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
    
    const tableData = yearBasisObject.map((monthElement) => {
        return { 
            Fecha: monthElement.date,
            Colecciones: monthElement.count
        }
    })
    
    console.table(tableData);

    const columns = tableData.map(x => x.Fecha);
    const row = tableData.map(x => x.Colecciones);

    utils.default.exportToCsv(columns, [row], "magic_eden.csv");
}

export default getMagicEdenStats;