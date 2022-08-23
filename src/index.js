import RichOutput from "rich-output";
import { getMagicEdenArithmeticAverage, getSolanArtArithmeticAverage, getOpenSeaArithmeticAverage } from "./marketplaces/index.js";
import { calculateArithmeticAverage, calculatePercentage } from "./math.js";

const openSeaArithmeticAverage = await getOpenSeaArithmeticAverage();
const magicEdenArithmeticAverage = await getMagicEdenArithmeticAverage();
const solanArtArithmeticAverage = await getSolanArtArithmeticAverage();

const arithmeticAverages = [magicEdenArithmeticAverage, solanArtArithmeticAverage, openSeaArithmeticAverage];

const arithmeticAverage = calculateArithmeticAverage(arithmeticAverages);
console.log(`Media aritmetica de lanzamiento de colecciones total: ${RichOutput.green(arithmeticAverage)}.`);

const estimatedQty = calculatePercentage(arithmeticAverage, 0.625)
console.log(`\nTotal estimado de colecciones con plataforma de staking: ${RichOutput.green(estimatedQty)}.`);