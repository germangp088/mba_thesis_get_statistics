import { readFile } from 'fs/promises';
import fetch from "node-fetch";

const getDataFromJSON = async (file) => JSON.parse(await readFile(new URL(file, import.meta.url)));

const getDataFromAPI = async (endpoint, options = undefined) => {
    let data;
    try {
        const response = await fetch(endpoint, options);

        if(response.status > 400){
            throw new Error(response.status);
        }

        data = await response.json();
    } catch (error) {
        throw new Error(error);
    }

    return data;
}

export { getDataFromJSON, getDataFromAPI };