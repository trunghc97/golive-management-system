export enum ServiceType {
    MICROSERVICE = 'MICROSERVICE',
    WEB = 'WEB',
    MOBILE_APP = 'MOBILE_APP',
    BATCH = 'BATCH'
}

export enum ChangeStatus {
    DRAFT = 'DRAFT',
    APPROVED = 'APPROVED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
    ROLLED_BACK = 'ROLLED_BACK'
}

export enum DeploymentStatus {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
    ROLLED_BACK = 'ROLLED_BACK'
}

export interface System {
    id: number;
    code: string;
    name: string;
    ownerDept?: string;
    description?: string;
}

export interface Service {
    id: number;
    code: string;
    name: string;
    type: ServiceType;
    systemId: number;
    systemCode: string;
    systemName: string;
    techStack?: string;
    gitRepoUrl?: string;
    deployPipelineUrl?: string;
    active: boolean;
}

export interface ServiceDependency {
    id: number;
    fromServiceId: number;
    fromServiceCode: string;
    fromServiceName: string;
    toServiceId: number;
    toServiceCode: string;
    toServiceName: string;
    dependencyType: string;
}

export interface ChangeRequest {
    id: number;
    changeCode: string;
    title: string;
    description?: string;
    systemId: number;
    systemCode: string;
    systemName: string;
    requester: string;
    environment: string;
    plannedStart: string;
    plannedEnd: string;
    actualStart?: string;
    actualEnd?: string;
    status: ChangeStatus;
    jiraTicket?: string;
    deployments?: ChangeServiceDeployment[];
}

export interface ChangeServiceDeployment {
    id: number;
    changeId: number;
    serviceId: number;
    serviceCode: string;
    serviceName: string;
    deployVersion: string;
    configVersion?: string;
    mrUrl?: string;
    pipelineUrl?: string;
    deployStart?: string;
    deployEnd?: string;
    status: DeploymentStatus;
    notes?: string;
}

export interface CreateChangeRequest {
    changeCode: string;
    title: string;
    description?: string;
    systemId: number;
    requester: string;
    environment: string;
    plannedStart: string;
    plannedEnd: string;
    status?: ChangeStatus;
    jiraTicket?: string;
    deployments?: CreateDeployment[];
}

export interface CreateDeployment {
    serviceId: number;
    deployVersion: string;
    configVersion?: string;
    mrUrl?: string;
    pipelineUrl?: string;
    notes?: string;
}

export interface ImpactAnalysis {
    serviceCode: string;
    serviceName: string;
    upstream: string[];
    downstream: string[];
    crossChangeRisk: string[];
}

export interface DashboardDay {
    date: string;
    changes: ChangeRequest[];
    totalChanges: number;
    totalDeployments: number;
}

export interface DashboardWeek {
    weekStart: string;
    weekEnd: string;
    days: DashboardDay[];
    totalChanges: number;
    totalDeployments: number;
}
