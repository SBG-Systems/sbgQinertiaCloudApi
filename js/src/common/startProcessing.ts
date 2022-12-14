import axios, { AxiosError } from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import apiInstance from "./apiInstance";
import getEnvVariable from "./getEnvVariable";
import { PresignedPost } from './QinertiaCloudApi/models';

const getFolderFiles = (folderPath: string) => {
    const folderContent = fs.readdirSync(folderPath);
    return folderContent.reduce((files, fileName) => {
        const filePath = path.join(folderPath, fileName);
        const fileStat = fs.statSync(filePath);
        if (fileStat.isFile()) {
            files.push(filePath);
        } else if (fileStat.isDirectory()) {
            const subfolderFiles = getFolderFiles(filePath);
            files.push(...subfolderFiles);
        }
        return files;
    }, [] as string[]);
}

const uploadFiles = async (files: string[], postData: PresignedPost, folderPath: string) => {
    const prefix = (postData.fields.key || '').replace('${filename}', '');
    const promises = files.map(async (filePath) => {
        const posixFilePath = filePath.replace(/\\/g, '/');
        const uploadFormData = new FormData();
        const relativeFilePath = posixFilePath.replace(folderPath, '');
        postData.fields.key = path.posix.join(prefix, relativeFilePath);
        Object.entries(postData.fields).map(([key, value]) => uploadFormData.append(key, value));
        uploadFormData.append('file', fs.createReadStream(filePath));
        try {
            const contentLength = await new Promise<number>((resolve, reject) => uploadFormData.getLength((err, length) => {
                if (err) reject(err);
                resolve(length);
            }))

            await axios({
                method: 'POST',
                url: postData.url,
                headers: {
                    ...uploadFormData.getHeaders(),
                    'Content-Length': contentLength,
                },
                data: uploadFormData,
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
            })
        } catch (err: any) {
            if ((err as AxiosError).toJSON) {
                const axiosError = err as AxiosError;
                console.log(axiosError.response?.data)
                console.warn(err.toJSON());
                throw new Error(`Failed to upload file: ${filePath}`);
            }
            throw err;
        }
    });
    await Promise.all(promises);
}

export async function startProcessing(region: string, projectName: string, processingJson: any, inputFolder?: string, resourceFolder?: string) {
    const project = await apiInstance.createProject(getEnvVariable('ORGANIZATION_ID'), {
        region: region,
    });
    console.log(`Project ${projectName} created`);
    console.log(project);

    if (inputFolder) {
        const inputPostData = await apiInstance.getInputPostData(project.id);
        const inputFolderFiles = getFolderFiles(inputFolder);
        await uploadFiles(inputFolderFiles, inputPostData, inputFolder);
    }

    if (resourceFolder) {
        const resourcesPostData = await apiInstance.getResourcesPostData(project.id);
        const resourcesFolderFiles = getFolderFiles(resourceFolder);
        await uploadFiles(resourcesFolderFiles, resourcesPostData, resourceFolder);
    }

    const processing = await apiInstance.startProcessing(project.id, { processingJson });
    console.log(`Processing started on project ${projectName}`);
    console.log(processing);
    return { project, processing };
}