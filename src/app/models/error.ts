export interface AppwriteError {
    code: number;
    file: string;
    line: number;
    message: string;
    version: string;
    trace: any[];
}