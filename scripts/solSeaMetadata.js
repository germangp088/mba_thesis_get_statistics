import puppeteer from "puppeteer";
import * as _ from "lodash";
import { buildMetadata, createMetadataFile } from "./buildMetadata.js";

const buildMagicEden = async () => {
    buildMetadata();

    const browser = await puppeteer.launch({
        headless: false,
    });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);

    await page.goto('https://solsea.io/k/all/all/f/2_all/', {
      waitUntil: 'networkidle2',
    });

    await page.content();
    const collectionsPerPage = await page.evaluate(() => document.getElementsByClassName("collection-wrapper").length);

    await page.waitForXPath('//*[@id="app"]/div[2]/div/div[2]/div/div/div[3]/div[41]/div/div/button[3]');
    const element = await page.$x(`//*[@id="app"]/div[2]/div/div[2]/div/div/div[3]/div[41]/div/div/button[3]`);
    const totalPages = parseInt(await page.evaluate(el => el.textContent, element[0]));

    await page.goto(`https://solsea.io/k/all/f/2_all+p_${totalPages}/`, {
      waitUntil: 'networkidle2',
    });

    const collectionsLastPage = await page.evaluate(() => document.getElementsByClassName("collection-wrapper").length);
   
    const totalCollections = (collectionsPerPage * (totalPages - 1)) + collectionsLastPage;

    const arithmeticAverage = Math.ceil(totalCollections / 12);

    const solSeaMetadata = { arithmeticAverage }

    const dictstring = JSON.stringify(solSeaMetadata);

    await browser.close();

    createMetadataFile(dictstring, "solsea.json");
}

await buildMagicEden();