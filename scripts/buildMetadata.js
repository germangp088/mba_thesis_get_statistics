import fs from "fs";
import buildMagicEden from "./magicEdenMetadata.js";
import buildSolanart from "./solanartMetadata.js";
import buildSolport from "./solportMetadata.js";

const folderName = './metadata';
if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName);
}

await buildMagicEden();
/*await buildSolanart();
await buildSolport();*/