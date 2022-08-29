import { exportToCsv } from "../utils.js";
import { getDataFromJSON, getDataFromAPI } from "../proxy.js";
import getStatistics from "./statistics.js";

const getSolportArithmeticAverage = async () => {
    const solportData = await getDataFromJSON("../metadata/solport.json");

    const filter = (solport, startDate, endDate) => solport.collections.filter(x => x.createdAt >= startDate &&
                                                                                        x.createdAt <= endDate)

    const solportStatistics = await getStatistics(solportData, filter, "Solport");

    exportToCsv(solportStatistics.months, [solportStatistics.collections], "solport.xlsx");

    return solportStatistics.arithmeticAverage;
}

export default getSolportArithmeticAverage;