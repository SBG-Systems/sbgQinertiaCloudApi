import fs from 'fs/promises';

import apiInstance from "./common/apiInstance";
import getEnvVariable from "./common/getEnvVariable";
import { startProcessing } from "./common/startProcessing";
import { downloadOutputData } from "./common/downloadOutputData";
import { waitForProcessing } from "./common/waitForProcessing";

(async () => {
    const outputFolder = getEnvVariable('OUTPUT_FOLDER');
    const processingJson = JSON.parse((await fs.readFile(getEnvVariable('PROCESSING_JSON'))).toString());

    const { project, processing } = await startProcessing(
        getEnvVariable('REGION'),
        `JS sample ${(new Date()).toLocaleString()}`,
        processingJson,
        getEnvVariable('INPUT_FOLDER'),
        getEnvVariable('RESOURCES_FOLDER'),
    );

    const endedProcessing = await waitForProcessing(processing.id);
    console.log('Processing results:');
    console.log(endedProcessing);

    const outputData = await apiInstance.getOutputData(project.id);
    await downloadOutputData(outputData, outputFolder);

    // await apiInstance.deleteProject(project.id);
})();