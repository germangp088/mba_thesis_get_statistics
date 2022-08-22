import { readFile } from 'fs/promises';
import buildYearBasis from "../utils.js";

const getMagicEdenStats = async () => {
    const yearBasisObject = buildYearBasis();

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
            Collecciones: monthElement.count
        }
    })
    
    console.table(tableData)
}

export default getMagicEdenStats;