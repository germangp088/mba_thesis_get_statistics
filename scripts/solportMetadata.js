import fs from "fs";
import _ from "lodash";
import "dotenv/config";
import { buildMetadata, createMetadataFile } from "./buildMetadata.js";
import { getDataFromJSON, getDataFromAPI } from "../src/proxy.js";

const solportApi = "https://lapi.solport.io/nft/collections?page=";
const MAX_REQUESTS = process.env.MAX_REQUESTS;
const MAX_CONCURRENCY = process.env.MAX_CONCURRENCY;
const MAX_RETRY = process.env.MAX_RETRY;
let urls = [];
let retries = 0;

const delay = (time) => new Promise(resolve => setTimeout(resolve, time));

const buildURLs = () => {
    for (let index = 0; index < MAX_REQUESTS; index++) {
        console.log(`Creando url indice: ${index}`);
        const page = index + 1;
        const url = `${solportApi}${page}`;
        urls.push(url);
    }
}

const buildRequests = (urls) => {
    const requests = [];

    for (let index = 0; index < urls.length; index++) {
        console.log(`Creando request indice: ${index}`);
        const request = fetchUrl(urls[index]);
        requests.push(request);
    }

    return requests;
}

const retry = async (responsesToRetry, responses) => {
    if (responsesToRetry.length > 0 && retries < MAX_RETRY) {
        console.log(`Reintento numero: ${(retries + 1)}`);
        responses = responses.filter(x => x.success);
        const urlsToRetry = responsesToRetry.map(x => x.url);

        // Delay operation to cool down rate limiter.
        await delay(_.parseInt(process.env.DELAY));
        
        retries++;

        // Executes fetchURLs recursivelly to retry the unsuccesfully requests.
        const retryResponses = await fetchURLs(urlsToRetry);
        responses = responses.concat(retryResponses);
    }
}

const fetchUrl = async (url) => {
    let data;
    try {
        const json = await getDataFromAPI(url);
        data = {
            ...json,
            success: true
        }
    } catch (error) {
        console.log(`Reintentando ${url}`);
        data = { url, success: false };
    }

    return data;
}

const fetchURLs = async(urls) => {
    const requests = buildRequests(urls);
    const maxSplit = Math.ceil(requests.length / MAX_CONCURRENCY);

    let responses = []
    for (let index = 0; index < maxSplit; index++) {
        const responsesExecuted = await Promise.all(requests.splice(0, MAX_CONCURRENCY));
        responses = responses.concat(responsesExecuted);
    }

    urls = responses.map((response) => !response.success ? response.url : '').filter(x => x != '');

    const responsesToRetry = responses.filter(x => !x.success);
    await retry(responsesToRetry, responses);

    return responses;
}

const filterData = (responses, success = true) => {
    const data = responses.filter(x => x.success == success);

    let jsonData = [];

    if (success) {
        data.forEach(element => {
            jsonData = jsonData.concat(element.collections);
        });
    } else {
        
        data.forEach(element => {
            jsonData.push(element.url);
        });
    }

    return jsonData;
}

// Create solport metadata file.
const buildSolport = async () => {
    buildMetadata();

    const urlsToRetry = await getDataFromJSON("../metadata/solport_failed.json", import.meta.url);
    if (urlsToRetry.length == 0) {
        buildURLs();
    } else {
        urls = urlsToRetry;
    }
    
    const responses = await fetchURLs(urls);
    const successData = filterData(responses, true);
    const failedData = filterData(responses, false);

    if (successData.length > 0) {
        const dictstring = JSON.stringify({collections: successData});
        createMetadataFile(dictstring, "solport.json");
    }

    if (failedData.length > 0) {
        const dictstringError = JSON.stringify(failedData);
        createMetadataFile(dictstringError, "solport_failed.json");
    } else {
        fs.unlinkSync("../metadata/solport_failed.json");
    }
}

await buildSolport();