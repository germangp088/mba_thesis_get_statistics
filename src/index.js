import RichOutput from "rich-output";
import "dotenv/config";
import { getMagicEdenArithmeticAverage, getSolanArtArithmeticAverage, getSolSeaArithmeticAverage } from "./marketplaces/index.js";
import { calculateArithmeticAverage, calculatePercentage } from "./math.js";

const magicEdenArithmeticAverage = await getMagicEdenArithmeticAverage();
const solanArtArithmeticAverage = await getSolanArtArithmeticAverage();
const solSeaArithmeticAverage = await getSolSeaArithmeticAverage();
const arithmeticAverages = [magicEdenArithmeticAverage, solanArtArithmeticAverage, solSeaArithmeticAverage]

const arithmeticAverage = calculateArithmeticAverage(arithmeticAverages);
console.log(`Media aritmética de listado de colecciones total: ${RichOutput.green(arithmeticAverage)}.`);

const highlightedText = (text) => RichOutput.underscore(RichOutput.bold(text));

const estimatedStakingQty = calculatePercentage(arithmeticAverage, process.env.STAKING_PERCENTAJE)
console.log(`\nTotal estimado de colecciones ${highlightedText('mensual')} con plataforma de staking: ${RichOutput.green(estimatedStakingQty)}.`);

const estimatedMintQty = calculatePercentage(arithmeticAverage, process.env.MINT_PERCENTAJE)
console.log(`\nTotal estimado de colecciones ${highlightedText('mensual')} con sitio de mint: ${RichOutput.green(estimatedMintQty)}.`);

const anualEstimatedStakingQty = estimatedStakingQty * 12;
console.log(`\nTotal estimado de colecciones ${highlightedText('anual')} con plataforma de staking: ${RichOutput.green(anualEstimatedStakingQty)}.`);

const anualEstimatedMintQty = estimatedMintQty * 12;
console.log(`\nTotal estimado de colecciones ${highlightedText('anual')} con sitio de mint: ${RichOutput.green(anualEstimatedMintQty)}.`);