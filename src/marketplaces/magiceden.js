import { exportToCsv } from "../utils.js";
import { getDataFromJSON, getDataFromAPI } from "../proxy.js";
import getStatistics from "./statistics.js";

const getMagicEdenArithmeticAverage = async () => {
    //const magicEdenData = await getDataFromAPI("https://api-mainnet.magiceden.io/all_collections_with_escrow_data");
    const magicEdenData = await getDataFromJSON("../metadata/magiceden.json", import.meta.url);
    
    const filter = (magicEden, startDate, endDate) => magicEden.collections.filter(x => x.createdAt >= startDate &&
                                                                                        x.createdAt <= endDate)

    const magicEdenStatistics = await getStatistics(magicEdenData, filter, "Magic Eden");

    exportToCsv(magicEdenStatistics.months, [magicEdenStatistics.collections], "magic_eden.xlsx");

    return magicEdenStatistics.arithmeticAverage;
}

export default getMagicEdenArithmeticAverage;