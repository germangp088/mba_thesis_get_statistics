import fs from "fs";
import { getDataFromAPI } from "../src/proxy.js";

const buildSolanart = async () => {
    const solanartData = await getDataFromAPI("https://api.solanart.io/get_collections");
    const dictstring = JSON.stringify(solanartData);
    fs.writeFileSync("./metadata/solanart.json", dictstring);
    console.log("Archivo creado solanart.json.");
}

export default buildSolanart;