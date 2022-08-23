import RichOutput from "rich-output";
import { buildYearBasis } from "../utils.js";
import { calculateArithmeticAverage } from "../math.js";

const getStatistics = async (data, filter, marketplace) => {
    const yearBasisObject = buildYearBasis();
    
    const getCollectionByMonth = (startDate, endDate) => filter(data, startDate, endDate);
    
    yearBasisObject.forEach(monthElement => {
        const monthListedCollections = getCollectionByMonth(monthElement.startDate, monthElement.endDate)
        monthElement.count = monthListedCollections?.length
    });
    
    console.log(RichOutput.underscore(RichOutput.bold(RichOutput.brightBlue(`Cantidad de colecciones listadas por mes en ${marketplace}.`))));
    const tableData = yearBasisObject.map((monthElement) => {
        return { 
            Fecha: monthElement.date,
            Colecciones: monthElement.count
        }
    });
    console.table(tableData);

    const months = tableData.map(x => x.Fecha).reverse();
    const collections = tableData.map(x => x.Colecciones).reverse();
    const arithmeticAverage = calculateArithmeticAverage(collections);

    console.log(`Media aritmetica de lanzamiento de colecciones: ${RichOutput.green(arithmeticAverage)}.\n`);

    return { arithmeticAverage, months, collections };
}

export default getStatistics;