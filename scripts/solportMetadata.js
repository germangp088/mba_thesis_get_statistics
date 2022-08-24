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
let urlsSuccess = [];
let urlsToRetry = [];
let retries = 0;

const combineArrays = (a, b) => a.concat(b.filter((item) => a.indexOf(item) < 0));

const delay = (time) => new Promise(resolve => setTimeout(resolve, time));

const getURLsQty = () => urls.length;

const buildURLs = async () => {
        
    if (fs.existsSync("./metadata/solport_success.json")) {
        urlsSuccess = await getDataFromJSON("../metadata/solport_success.json", import.meta.url);
    }

    if (fs.existsSync("./metadata/solport_failed.json")) {
        urlsToRetry = await getDataFromJSON("../metadata/solport_failed.json", import.meta.url);
        urlsToRetry = urlsToRetry.filter(x => !urlsSuccess.some(y => y == x));
        if (urlsToRetry.length > 0) {
            urls = urls.concat(urlsToRetry)
        }
    }

    
    let max_requests_difference =  MAX_REQUESTS - getURLsQty();

    if (max_requests_difference > 0) {
        let index = 0;
        while (max_requests_difference > 0) {
            const page = index + 1;
            const url = `${solportApi}${page}`;
    
            const existsOnFailed = urlsToRetry.some(x => x == url);
            const existsOnSuccess = urlsSuccess.some(x => x == url);
    
            if (!existsOnFailed && !existsOnSuccess) {
                console.log(`Creando url indice: ${index}`);
                urls.push(url);
            }
            index++;
            max_requests_difference =  MAX_REQUESTS - getURLsQty()
        }
    } else if(max_requests_difference < 0) {
        urls = urls.slice(0, MAX_REQUESTS);
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
        const urlsToExecuteRetry = responsesToRetry.map(x => x.url);

        // Delay operation to cool down rate limiter.
        await delay(_.parseInt(process.env.DELAY));
        
        retries++;

        // Executes fetchURLs recursivelly to retry the unsuccesfully requests.
        const retryResponses = await fetchURLs(urlsToExecuteRetry);
        responses = responses.concat(retryResponses);
    }
}

const fetchUrl = async (url) => {
    let data;
    try {
        const json = await getDataFromAPI(url);
        data = {
            ...json,
            url,
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
        await delay(_.parseInt(process.env.DELAY));
        responses = responses.concat(responsesExecuted);
    }

    urls = responses.map((response) => !response.success ? response.url : '').filter(x => x != '');

    const successResponses = responses.filter(x => x.success);
    urls = urls.filter(x => !successResponses.some(y => y.url == x));

    const responsesToRetry = responses.filter(x => !x.success && !successResponses.some(y => y.url == x.url));
    if (responsesToRetry.length > 0) {
        await retry(responsesToRetry, responses);
    }

    return responses;
}

const filterData = (responses, success = true) => {
    const data = responses.filter(x => x.success == success);

    let jsonData = [];

    if (success) {
        data.forEach(element => {
            if (element.collections.length > 0) {
                jsonData = jsonData.concat(element.collections);
            }
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
    const solportData = await getDataFromJSON("../metadata/solport.json", import.meta.url);
    buildMetadata();
    await buildURLs();
    
    const responses = await fetchURLs(urls);
    
    const urlsExecutedSucessfully = _.cloneDeep(responses.filter(x => x.success)).map(x => x.url);

    const successData = filterData(responses, true);
    const failedData = filterData(responses, false);

    if (successData.length > 0) {
        urlsToRetry = urlsToRetry.filter(x => !urlsExecutedSucessfully.some(y => y == x));
        const newSolportData = {
            collections: combineArrays(solportData.collections, successData)
        }
        const dictstring = JSON.stringify(newSolportData);
        createMetadataFile(dictstring, "solport.json");
        const newSuccessURLs = combineArrays(urlsSuccess, urlsExecutedSucessfully);
        const jsonURLs = JSON.stringify(newSuccessURLs);
        createMetadataFile(jsonURLs, "solport_success.json");
    }

    if (failedData.length > 0) {
        const newFailedURLs = combineArrays(urlsToRetry, failedData);
        const jsonFailedURLs = JSON.stringify(newFailedURLs);
        createMetadataFile(jsonFailedURLs, "solport_failed.json");
    } else {
        fs.unlinkSync("./metadata/solport_failed.json");
    }
}

await buildSolport();