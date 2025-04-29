export enum ProcessingStatus {
	Pending = "pending",
	Processing = "processing",
	Processed = "processed",
	Canceled = "canceled",
	Archived = "archived",
}

export enum ProcessingStep {
	Import = "import",
	BaseStation = "base_station",
	Preprocessing = "preprocessing",
	Processing = "processing",
	Export = "export",
	Report = "report",
}

export enum ProcessingType {
	Gnss = "gnss",
	Ins = "ins",
}

export enum ProcessingResult {
	Succeeded = "succeeded",
	Failed = "failed",
}

export enum ContextStatus {
	Valid = "valid",
	Archived = "archived",
}

export enum ContainerFileType {
	Input = 'input',
	Resources = 'resources',
}

export enum ContainerFileStatus {
	Pending = 'pending',
	Ready = 'ready',
	Deleting = 'deleting',
	Deleted = 'deleted',
}

export type Metadata = Record<string, string>;

export interface ErrorCount {
	errors: number;
	warnings: number;
}

export interface ContainerFile {
	id: string;
	type: ContainerFileType;
	status: ContainerFileStatus;
	size: number | null;
	path: string;
	createdAt: string;
	updatedAt: string;
	creatorId: string;
	metadata: Metadata;
	uploadInfo: PresignedPost | null;
}

export interface Processing {
	id: string;
	name: string;
	type: ProcessingType;
	status: ProcessingStatus;
	region: string;
	processingResult: ProcessingResult | null;
	processingDuration: number | null;
	processingStep: ProcessingStep | null;
	processingProgress: number | null;
	archiveScheduledAt: string;
	createdAt: string;
	updatedAt: string;
	creatorId: string;
	organizationId: string;
	containerId: string | null;
	errorCount: ErrorCount;
	missionLength: number | null;
	missionLocationCountry: string | null;
	missionLocationRegion: string | null;
	missionLocationPlace: string | null;
	metadata: Metadata;
	processingJson: ProcessingJson;
}

export type ProcessingJson = any;

export type StartProcessing = {
	containerId: string;
	processingJson: ProcessingJson;
	reporterEmail?: string;
	metadata?: Metadata;
	name?: string;
}

export interface PresignedPost {
	url: string;
	fields: Record<string, string>;
}

export interface OutputData {
	path: string;
	url: string;
}

export type CreateContainerFile = {
	path: string;
	type: ContainerFileType;
	size: number;
	metadata?: Metadata;
}

export type CreateContainer = {
	region: string;
	files?: CreateContainerFile[];
	metadata?: Metadata;
}

export interface AddContainerFiles {
	files: CreateContainerFile[];
}

export type AddFilesToContainerInput = {
	files: CreateContainerFile[];
}

export interface Container {
	id: string;
	region: string;
	status: ContextStatus;
	createdAt: string;
	updatedAt: string;
	creatorId: string;
	organizationId: string;
	metadata: Metadata;
	files: ContainerFile[];
}