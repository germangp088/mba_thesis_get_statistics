import RichOutput from "rich-output";
import "dotenv/config";
import { getMagicEdenArithmeticAverage, getSolanArtArithmeticAverage } from "./marketplaces/index.js";
import { calculateArithmeticAverage, calculatePercentage } from "./math.js";

const magicEdenArithmeticAverage = await getMagicEdenArithmeticAverage();
const solanArtArithmeticAverage = await getSolanArtArithmeticAverage();

const arithmeticAverage = calculateArithmeticAverage([magicEdenArithmeticAverage, solanArtArithmeticAverage]);
console.log(`Media aritmetica de lanzamiento de colecciones total: ${RichOutput.green(arithmeticAverage)}.`);

const estimatedStakingQty = calculatePercentage(arithmeticAverage, process.env.STAKING_PERCENTAJE)
console.log(`\nTotal estimado de colecciones con plataforma de staking: ${RichOutput.green(estimatedStakingQty)}.`);

const estimatedMintQty = calculatePercentage(arithmeticAverage, process.env.MINT_PERCENTAJE)
console.log(`\nTotal estimado de colecciones con sitio de mint: ${RichOutput.green(estimatedMintQty)}.`);