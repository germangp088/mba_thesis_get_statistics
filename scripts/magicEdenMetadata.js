import puppeteer from "puppeteer";
import { buildMetadata, createMetadataFile } from "./buildMetadata.js";

const buildMagicEden = async () => {
    buildMetadata();

    const browser = await puppeteer.launch({
        headless: false,
    });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);

    await page.goto('https://api-mainnet.magiceden.io/all_collections_with_escrow_data', {
      waitUntil: 'networkidle2',
    });

    await page.content();

    const dictstring = await page.evaluate(() =>  document.querySelector("body>pre").innerText); 
  
    await browser.close();

    createMetadataFile(dictstring, "magiceden.json");
}

await buildMagicEden();