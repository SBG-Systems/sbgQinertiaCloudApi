import Axios from 'axios';
import { PresignedPost, OutputData, StartProcessing, Processing, CreateContainer, Container, AddContainerFiles, ContainerFile } from './models';

export type QinertiaCloudApiProps = {
    getAccessToken: () => Promise<string> | string;
    baseUrl: string;
};

export class QinertiaCloudApi {
    baseUrl: string;
    getAccessToken: () => Promise<string>;

    constructor(props: QinertiaCloudApiProps) {
        this.getAccessToken = async () => props.getAccessToken();
        this.baseUrl = `${props.baseUrl}/api/v2`;
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

	async createContainer(
		organizationId: string,
		data: CreateContainer,
	) {
		const axiosInstance = await this.getAxiosInstance();
		return (await axiosInstance.post<Container>(
			`/organizations/${organizationId}/containers`, data,
		)).data;
	}

    async addContainerFiles(
		containerId: string,
		data: AddContainerFiles,
	) {
		const axiosInstance = await this.getAxiosInstance();
		return (await axiosInstance.post<ContainerFile[]>(
			`/containers/${containerId}/files`, data
        )).data;
	}

    async getProcessingOutputData(
		processingId: string,
	) {
		const axiosInstance = await this.getAxiosInstance();
		return (await axiosInstance.get<OutputData[]>(
			`/processings/${processingId}/output`,
		)).data;
	}

    async deleteContainer(
		containerId: string,
	) {
		const axiosInstance = await this.getAxiosInstance();
		await axiosInstance.delete(
			`/containers/${containerId}`,
		);
	}

    async startProcessing(
		organizationId: string,
		data: StartProcessing,
	) {
		const axiosInstance = await this.getAxiosInstance();
		return (await axiosInstance.post<Processing>(
			`/organizations/${organizationId}/processings`, data,
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
