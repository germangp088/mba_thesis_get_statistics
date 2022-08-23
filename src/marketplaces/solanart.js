import { readFile } from 'fs/promises';
import RichOutput from "rich-output";
import { buildYearBasis, exportToCsv } from "../utils.js";
import { calculateArithmeticAverage } from "../math.js";

const getSolanArtArithmeticAverage = async () => {
    const yearBasisObject = buildYearBasis();

    const solanart = JSON.parse(await readFile(new URL('./metadata/solanart.json', import.meta.url)));
    
    const getDate = (seconds) => new Date(seconds * 1000).toISOString()
    
    const getCollectionByMonth = (startDate, endDate) =>
                                    solanart.filter(x => getDate(x.date) >= startDate &&
                                        getDate(x.date) <= endDate);
    
    yearBasisObject.forEach(monthElement => {
        const monthListedCollections = getCollectionByMonth(monthElement.startDate, monthElement.endDate)
        monthElement.count = monthListedCollections?.length
    });
    
    console.log(RichOutput.underscore(RichOutput.bold(RichOutput.brightBlue("Cantidad de colecciones listadas por mes en Solanart."))));
    const tableData = yearBasisObject.map((monthElement) => {
        return { 
            Fecha: monthElement.date,
            Colecciones: monthElement.count
        }
    })
    console.table(tableData);

    const months = tableData.map(x => x.Fecha).reverse();
    const collections = tableData.map(x => x.Colecciones).reverse();
    const magicEdenArithmeticAverage = calculateArithmeticAverage(collections);

    console.log(`Media aritmetica de lanzamiento de colecciones: ${RichOutput.green(magicEdenArithmeticAverage)}.`);

    exportToCsv(months, [collections], "solanart.xlsx");

    return magicEdenArithmeticAverage;
}

export default getSolanArtArithmeticAverage;