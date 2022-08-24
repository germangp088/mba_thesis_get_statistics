import { exportToCsv } from "../utils.js";
import { getDataFromJSON } from "../proxy.js";
import getStatistics from "./statistics.js";

const getSolSeaArithmeticAverage = async () => {
    const solSeaData = await getDataFromJSON("../metadata/solsea.json", import.meta.url);

    const filter = (_) => new Array(solSeaData.arithmeticAverage);
    
    const solanartStatistics = await getStatistics(solSeaData, filter, "SolSea");

    exportToCsv(solanartStatistics.months, [solanartStatistics.collections], "sol_sea.xlsx");

    return solanartStatistics.arithmeticAverage;
}

export default getSolSeaArithmeticAverage;