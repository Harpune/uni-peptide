import { Permission } from './permission';
export interface Institute {
    $collection: string;
    $id: string;
    $permissions: Permission;
    name: string;
    organisation: string;
    address: string;
    teamId: string;
    created: string;
    updated: string;
    projects: Project[];
}

export interface Project {
    $collection: string;
    $id: string;
    $permissions: Permission;
    name: string;
    description: string;
    date: string;
    created: string;
    updated: string;
    subprojects: Project[];
    peptideLibraries: PeptideLibrary[];
}

export interface PeptideLibrary {
    $collection: string;
    $id: string;
    $permissions: Permission;
    name: string;
    organism: string;
    description: string;
}