export enum ProcessingStatus {
    Queuing = "queuing",
    Pending = "pending",
    Processing = "processing",
    Processed = "processed",
    Failed = "failed",
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

export interface Metadata {
    key: string;
    value: string;
}

export interface ErrorCount {
    errors: number;
    warnings: number;
}

export interface Project {
    id: string;
    region: string;
    createdAt: string;
    updatedAt: string;
    creatorName: string;
    organizationName: string;
    creatorId: string;
    organizationId: string;
    lastProcessing: Processing | null;
    metadata: Metadata[];
}

export interface Processing {
    id: string;
    type: ProcessingType;
    status: ProcessingStatus;
    duration: number | null;
    processingStep: ProcessingStep | null;
    processingProgress: number | null;
    createdAt: string;
    updatedAt: string;
    creatorName: string;
    creatorId: string;
    errorCount: ErrorCount;
    missionLength: number | null;
    missionLocationCountry: string | null;
    missionLocationRegion: string | null;
    missionLocationPlace: string | null;
    metadata: Metadata[];
}

export type ProcessingJson = any;

export interface CreateProject {
    region: string;
    metadata?: Metadata[];
}

export interface StartProcessing {
    processingJson: ProcessingJson;
    metadata?: Metadata[];
}

export interface PresignedPost {
    url: string;
    fields: Record<string, string>;
}

export interface OutputData {
    path: string;
    url: string;
}