import { Permission } from './permission';

export interface Institute {
    $collection: string;
    $id: string;
    $permissions: Permission;
    name: string;
    organisation: string;
    address: string;
    teamId: string;
}