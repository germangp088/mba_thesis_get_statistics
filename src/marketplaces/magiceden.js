import { exportToCsv } from "../utils.js";
import { getDataFromJSON } from "../proxy.js";
import getStatistics from "./statistics.js";

const getMagicEdenArithmeticAverage = async () => {
    const magicEdenData = await getDataFromJSON("../metadata/magiceden.json");
    
    const filter = (magicEden, startDate, endDate) => magicEden.collections.filter(x => x.createdAt >= startDate &&
                                                                                        x.createdAt <= endDate)

    const magicEdenStatistics = await getStatistics(magicEdenData, filter, "Magic Eden");

    exportToCsv(magicEdenStatistics.months, [magicEdenStatistics.collections], "magic_eden.xlsx");

    return magicEdenStatistics.arithmeticAverage;
}

export default getMagicEdenArithmeticAverage;