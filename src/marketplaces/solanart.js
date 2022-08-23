import { exportToCsv } from "../utils.js";
import { getDataFromJSON } from "../proxy.js";
import getStatistics from "./statistics.js";

const getSolanArtArithmeticAverage = async () => {
    const solanartData = await getDataFromJSON("../metadata/solanart.json", import.meta.url);

    const getDate = (seconds) => new Date(seconds * 1000).toISOString();
    const filter = (solanart, startDate, endDate) => solanart.filter(x => getDate(x.date) >= startDate &&
                                                                            getDate(x.date) <= endDate);
    
    const solanartStatistics = await getStatistics(solanartData, filter, "Solanart");

    exportToCsv(solanartStatistics.months, [solanartStatistics.collections], "solanart.xlsx");

    return solanartStatistics.arithmeticAverage;
}

export default getSolanArtArithmeticAverage;