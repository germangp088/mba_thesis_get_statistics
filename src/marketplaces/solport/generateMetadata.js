import fs from "fs";
import { getDataFromAPI } from "../../proxy.js";
import _ from "lodash";
import "dotenv/config";

const solportApi = "https://lapi.solport.io/nft/collections?page=";
const MAX_REQUESTS = process.env.MAX_REQUESTS;
const MAX_RETRY = process.env.MAX_RETRY;
let urls = [];
let retries = 0;

const delay = (time) => new Promise(resolve => setTimeout(resolve, time));

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

const fetchURLs = async(urls) => {
    const requests = buildRequests(urls);

    let responses = [];

    const responsesExecuted = await Promise.all(requests);
    responses = responses.concat(responsesExecuted);

    urls = responses.map((response) => !response.success ? response.url : '').filter(x => x != '');

    const responsesToRetry = responses.filter(x => !x.success);
    await retry(responsesToRetry, responses);

    return responses;
}

// Create solport metadata file
buildURLs();
fetchURLs(urls).then((responses) => {
    const data = _.cloneDeep(responses.filter(x => x.success));
    console.log(data)
    let jsonData = [];

    data.forEach(element => {
        jsonData = jsonData.concat(element.collections);
    });

    var dictstring = JSON.stringify({collections: jsonData});
    fs.writeFileSync("./metadata/solport.json", dictstring);
    console.log("Archivo creado solport.json.");
});