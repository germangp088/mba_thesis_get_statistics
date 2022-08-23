import fs from "fs";

const buildMetadata = () => {
    const folderName = './metadata';
    if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName);
    }
}

export default buildMetadata;