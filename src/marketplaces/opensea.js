import * as Web3 from 'web3';
import { OpenSeaSDK, Network } from 'opensea-js';
//import sdk from "api";
import { exportToCsv } from "../utils.js";
import { getDataFromJSON, getDataFromAPI } from "../proxy.js";
import getStatistics from "./statistics.js";



const getOpenSeaArithmeticAverage = async () => {
    //const openSeaData = await getDataFromJSON("../metadata/opensea.json", import.meta.url);
    //const openSeaSDK = sdk('@opensea/v1.0#mxj1ql5k6c0il');
    const provider = new Web3.providers.HttpProvider('https://mainnet.infura.io')

    const openseaSDK = new OpenSeaSDK(provider, {
        networkName: Network.Main,
        apiKey: YOUR_API_KEY
    });

    let openSeaData = null
    try {
        //openseaSDK.api.getAssets()
        openSeaData = await openseaSDK.retrievingCollections({offset: '0', limit: '300'});
    } catch (error) {
        console.error(error);
    }
    
    const filter = (openSea, startDate, endDate) => openSea.collections.filter(x => x.createdAt >= startDate &&
                                                                                        x.createdAt <= endDate)

    const openSeaStatistics = await getStatistics(openSeaData, filter, "Open Sea");

    exportToCsv(openSeaStatistics.months, [openSeaStatistics.collections], "open_sea.xlsx");

    return openSeaStatistics.arithmeticAverage;
}

export default getOpenSeaArithmeticAverage;
