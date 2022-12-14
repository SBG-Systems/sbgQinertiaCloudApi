import axios, { AxiosError } from 'axios';
import { OutputData } from './QinertiaCloudApi/models';
import fs, { createWriteStream } from 'fs';
import path from 'path';
import { finished } from 'stream/promises';

function createFolder(filePath: string) {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    fs.mkdirSync(dirname, { recursive: true });
}

export async function downloadOutputData(outputData: OutputData[], folder: string) {
    await Promise.all(outputData.map(async (outputFile) => {
        const filePath = path.join(folder, outputFile.path);
        console.log(`Start downloading ${filePath}`);
        createFolder(filePath);
        const writer = createWriteStream(filePath, { flags: 'w+' });
        await axios({
            method: 'get',
            url: outputFile.url,
            responseType: 'stream',
        }).then(response => {
            response.data.pipe(writer);
            console.log(`${filePath} downloaded`);
            return finished(writer);
        });
    }));
    console.log('Finished downloading output files');
}