import fs from "fs";

const buildMetadata = () => {
    const folderName = './metadata';
    if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName);
    }
}

const createMetadataFile = (dictstring, filename = "metadata.json") => {
    fs.writeFileSync(`./metadata/${filename}`, dictstring);
    console.log(`Archivo creado ${filename}`);
}

export { buildMetadata, createMetadataFile };