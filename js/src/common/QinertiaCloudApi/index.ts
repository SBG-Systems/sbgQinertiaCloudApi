import Axios from 'axios';
import { CreateProject, Project, PresignedPost, OutputData, StartProcessing, Processing } from './models';

export type QinertiaCloudApiProps = {
    getAccessToken: () => Promise<string> | string;
    baseUrl: string;
};

export class QinertiaCloudApi {
    baseUrl: string;
    getAccessToken: () => Promise<string>;

    constructor(props: QinertiaCloudApiProps) {
        this.getAccessToken = async () => props.getAccessToken();
        this.baseUrl = `${props.baseUrl}/api/v1`;
    }

    async getAxiosInstance() {
        const headers = {
            Authorization: `Bearer ${await this.getAccessToken()}`,
        };

        return Axios.create({
            baseURL: this.baseUrl,
            headers,
        });
    }

    async createProject(
        organizationId: string,
        data: CreateProject,
    ) {
        const axiosInstance = await this.getAxiosInstance();
        return (await axiosInstance.post<Project>(
            `/organizations/${organizationId}/projects`, data,
        )).data;
    }

    async getInputPostData(
        projectId: string,
    ) {
        const axiosInstance = await this.getAxiosInstance();
        return (await axiosInstance.get<PresignedPost>(
            `/projects/${projectId}/input`,
        )).data;
    }

    async getResourcesPostData(
        projectId: string,
    ) {
        const axiosInstance = await this.getAxiosInstance();
        return (await axiosInstance.get<PresignedPost>(
            `/projects/${projectId}/resources`,
        )).data;
    }

    async getOutputData(
        projectId: string,
    ) {
        const axiosInstance = await this.getAxiosInstance();
        return (await axiosInstance.get<OutputData[]>(
            `/projects/${projectId}/output`,
        )).data;
    }

    async deleteProject(
        projectId: string,
    ) {
        const axiosInstance = await this.getAxiosInstance();
        await axiosInstance.delete(
            `/projects/${projectId}`,
        );
    }

    async startProcessing(
        projectId: string,
        data: StartProcessing,
    ) {
        const axiosInstance = await this.getAxiosInstance();
        return (await axiosInstance.post<Processing>(
            `/projects/${projectId}/processings`, data,
        )).data;
    }

    async getProcessing(
        processingId: string,
    ) {
        const axiosInstance = await this.getAxiosInstance();
        return (await axiosInstance.get<Processing>(
            `/processings/${processingId}`,
        )).data;
    }
}
