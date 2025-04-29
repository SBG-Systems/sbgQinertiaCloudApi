import fs from 'fs/promises';

import apiInstance from "./common/apiInstance";
import getEnvVariable from "./common/getEnvVariable";
import { startProcessing } from "./common/startProcessing";
import { downloadOutputData } from "./common/downloadOutputData";
import { waitForProcessing } from "./common/waitForProcessing";
import { AxiosError } from 'axios';

(async () => {
    const outputFolder = getEnvVariable('OUTPUT_FOLDER');
    const processingJson = JSON.parse((await fs.readFile(getEnvVariable('PROCESSING_JSON'))).toString());
    try {
        const { container, processing } = await startProcessing(
            getEnvVariable('REGION'),
            `JS sample ${(new Date()).toLocaleString()}`,
            processingJson,
            getEnvVariable('INPUT_FOLDER'),
            getEnvVariable('RESOURCES_FOLDER'),
        );
        const endedProcessing = await waitForProcessing(processing!.id);
        console.log('Processing results:');
        console.log(endedProcessing);

        const outputData = await apiInstance.getProcessingOutputData(processing!.id);
        await downloadOutputData(outputData, outputFolder);

        await apiInstance.deleteContainer(container.id);
    } catch (err: any) {
        if ((err as AxiosError).toJSON) {
            const axiosError = err as AxiosError;
            console.warn(err.toJSON());
            console.log('Response error body:', axiosError.response?.data);
            process.exit(1);
        }
        throw err;
    }
})();