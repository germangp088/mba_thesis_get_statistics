import { exportToCsv } from "../utils.js";
import { getDataFromJSON, getDataFromAPI } from "../proxy.js";
import getStatistics from "./statistics.js";

const getSolportArithmeticAverage = async () => {
    //const solportData = await getDataFromAPI("https://api-mainnet.magiceden.io/all_collections_with_escrow_data");
    const solportData = await getDataFromJSON("../metadata/solport.json", import.meta.url);

    const filter = (solport, startDate, endDate) => solport.collections.filter(x => x.createdAt >= startDate &&
                                                                                        x.createdAt <= endDate)

    const solportStatistics = await getStatistics(solportData, filter, "Solport");

    exportToCsv(solportStatistics.months, [solportStatistics.collections], "solport.xlsx");

    return solportStatistics.arithmeticAverage;
}

export default getSolportArithmeticAverage;