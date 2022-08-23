import RichOutput from "rich-output";
import { getMagicEdenArithmeticAverage, getSolanArtArithmeticAverage } from "./marketplaces/index.js";
import { calculateArithmeticAverage, calculatePercentage } from "./math.js";

const magicEdenArithmeticAverage = await getMagicEdenArithmeticAverage();

const solanArtArithmeticAverage = await getSolanArtArithmeticAverage();

const arithmeticAverage = calculateArithmeticAverage([magicEdenArithmeticAverage, solanArtArithmeticAverage]);
 
console.log(`\nMedia aritmetica de lanzamiento de colecciones total: ${RichOutput.green(arithmeticAverage)}.`);

const estimatedQty = calculatePercentage(arithmeticAverage, 0.625)
console.log(`\nTotal estimado de colecciones con plataforma de staking: ${RichOutput.green(estimatedQty)}.`);