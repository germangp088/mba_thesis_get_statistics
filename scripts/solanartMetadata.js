import fs from "fs";
import { getDataFromAPI } from "../src/proxy.js";
import buildMetadata from "./buildMetadata.js";

const buildSolanart = async () => {
    buildMetadata();
    const solanartData = await getDataFromAPI("https://api.solanart.io/get_collections");
    const dictstring = JSON.stringify(solanartData);
    fs.writeFileSync("./metadata/solanart.json", dictstring);
    console.log("Archivo creado solanart.json.");
}

await buildSolanart();