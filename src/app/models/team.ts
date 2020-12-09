import { Permission } from './permission';

export interface Team {
    $collection: string;
    $id: string;
    $permissions: Permission;
    dateCreated: string;
    name: string;
    sum: string;
}