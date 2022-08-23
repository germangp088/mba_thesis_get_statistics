import fs from "fs";
import { getDataFromAPI } from "../src/proxy.js";
import { buildMetadata, createMetadataFile } from "./buildMetadata.js";

const buildSolanart = async () => {
    buildMetadata();
    const solanartData = await getDataFromAPI("https://api.solanart.io/get_collections");

    const dictstring = JSON.stringify(solanartData);
    createMetadataFile(dictstring, "solanart.json");
}

await buildSolanart();