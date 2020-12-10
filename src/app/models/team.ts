import { Permission } from './permission';

export interface Team {
    $collection: string;
    $id: string;
    $permissions: Permission;
    dateCreated: number;
    name: string;
    sum: number;
}