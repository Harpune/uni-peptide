import { Permission } from './permission';

export interface Team {
    $collection: string;
    $id: string;
    $permissions: Permission;
    dateCreated: number;
    name: string;
    sum: number;
}

export interface Membership {
    $id: string;
    confirm: boolean;
    email: string;
    invited: number;
    joined: number;
    name: string;
    roles: string[];
    teamId: string;
    userId: string;
}