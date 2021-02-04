import { Permission } from "./permission";

export interface AppwriteFile {
    $collection: string;
    $id: string;
    $permissions: Permission;
    algorithm: string;
    comment: string;
    dateCreated: number;
    fileOpenSSLCipher: string;
    fileOpenSSLIV: string;
    fileOpenSSLTag: string;
    fileOpenSSLVersion: string;
    folderId: string;
    mimeType: string;
    name: string;
    path: string;
    signature: string;
    sizeActual: number;
    sizeOriginal: number;
    token: string;
}