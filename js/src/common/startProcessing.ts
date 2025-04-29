import axios, { AxiosError } from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import apiInstance from "./apiInstance";
import getEnvVariable from "./getEnvVariable";
import { ContainerFile, ContainerFileType } from './QinertiaCloudApi/models';

const getFolderFiles = (folderPath: string) => {
    const folderContent = fs.readdirSync(folderPath);
    return folderContent.reduce((files, fileName) => {
        const filePath = path.join(folderPath, fileName);
        const fileStat = fs.statSync(filePath);
        if (fileStat.isFile()) {
            files.push({ path: filePath, size: fileStat.size });
        } else if (fileStat.isDirectory()) {
            const subfolderFiles = getFolderFiles(filePath);
            files.push(...subfolderFiles);
        }
        return files;
    }, [] as { path: string, size: number }[]);
}

export const uploadFile = async (file: ContainerFile, localPath: string) => {
    if (!file.uploadInfo)
    {
        console.log('No upload info for file', file.path);
        console.log(file);
        return;
    }

    const uploadFormData = new FormData();
    Object.entries(file.uploadInfo.fields).map(([key, value]) => uploadFormData.append(key, value));
    uploadFormData.append('file', fs.createReadStream(localPath));

    try {
        const contentLength = await new Promise<number>((resolve, reject) => uploadFormData.getLength((err, length) => {
            if (err) reject(err);
            resolve(length);
        }));

        await axios({
            method: 'POST',
            url: file.uploadInfo.url,
            headers: {
                ...uploadFormData.getHeaders(),
                'Content-Length': contentLength,
            },
            data: uploadFormData,
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
        });
    } catch (err: any) {
        if ((err as AxiosError).toJSON) {
            const axiosError = err as AxiosError;
            console.log(axiosError.response?.data)
            console.warn(err.toJSON());
            throw new Error(`Failed to upload file: ${file.path}`);
        }
        throw err;
    }
}

const uploadFiles = async (containerId: string, folderPath: string, fileType: ContainerFileType) =>
{
    const files = getFolderFiles(folderPath).filter((f) => !f.path.endsWith('.gitkeep'));

    if (files.length === 0) {
        return;
    }

    const containerFiles = await apiInstance.addContainerFiles(containerId, {
        files: files.map((file) =>
        {
            //
            // Get relative path to remove folderPath
            // filePath: data/input/base/sbgs167o.20d
            // qinertiaCloudPath: base/sbgs167o.20d
            //
            const posixFilePath = file.path.replace(/\\/g, '/');
            const qinertiaCloudPath = path.posix.relative(folderPath, posixFilePath);
            return {
                path: qinertiaCloudPath,
                type: fileType,
                size:file.size,
            };
        }),
    });

    for (const file of containerFiles) {
        const localPath = path.join(folderPath, file.path);
        console.log(`Uploading file to container: ${file.path} (${localPath})`);
        await uploadFile(file, localPath);
    }
}

export async function startProcessing(region: string, processingName: string, processingJson: any, inputFolder?: string, resourceFolder?: string) {
    const container = await apiInstance.createContainer(getEnvVariable('ORGANIZATION_ID'), {
        region: region,
    });
    console.log(`Container created`);
    console.log(container);

    if (inputFolder) {
        await uploadFiles(container.id, inputFolder, ContainerFileType.Input);
    }

    if (resourceFolder) {
        await uploadFiles(container.id, resourceFolder, ContainerFileType.Resources);
    }

    const processing = await apiInstance.startProcessing(getEnvVariable('ORGANIZATION_ID'), { containerId: container.id, name: processingName, processingJson });
    console.log(`Processing ${processingName} started`);
    console.log(processing);

    return { container, processing };
}