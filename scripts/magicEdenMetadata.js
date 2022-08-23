import fs from "fs";
import { getDataFromAPI } from "../src/proxy.js";


const buildMagicEden = async () => {
    const magicEdenData = await getDataFromAPI("https://api-mainnet.magiceden.io/all_collections_with_escrow_data",
    {
        headers: { 
            "Content-Type": "application/json",
        }
    });

    const dictstring = JSON.stringify(magicEdenData);
    fs.writeFileSync("./metadata/magiceden.json", dictstring);
    console.log("Archivo creado magiceden.json.");
}

export default buildMagicEden;