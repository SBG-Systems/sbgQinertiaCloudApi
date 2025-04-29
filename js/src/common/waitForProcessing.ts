import { AxiosError } from 'axios';
import apiInstance from "./apiInstance";
import { Processing, ProcessingStatus } from './QinertiaCloudApi/models';

export async function waitForProcessing(processingId: string, callback?: (p: Processing) => void, maxWaitTime = 10 * 60) {
    const maxTime = new Date();
    maxTime.setSeconds(maxTime.getSeconds() + maxWaitTime);
    return new Promise<Processing>((resolve, reject) => {
        let lastStatus: ProcessingStatus | undefined;
        const intervalId = setInterval(async () => {
            let processing: Processing;
            try {
                processing = await apiInstance.getProcessing(processingId);
            } catch (err) {
                const axiosError = err as AxiosError;
                clearInterval(intervalId);
                reject(axiosError.toJSON ? axiosError.toJSON() : err);
                return;
            }
            if (callback) callback(processing);

            if (lastStatus !== processing.status) {
                console.log(`\nProcessing id: ${processingId} status changed to ${processing.status}`);
            }
            else {
                process.stdout.write(".");
            }
            lastStatus = processing.status;

            if (lastStatus !== ProcessingStatus.Processing && lastStatus !== ProcessingStatus.Pending) {
                clearInterval(intervalId);
                resolve(processing);
            }

            if (new Date() > maxTime) {
                clearInterval(intervalId);
                reject('Timeout');
            }
        }, 1000);
    })
}