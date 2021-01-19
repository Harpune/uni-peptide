import { Permission } from "./permission";

export interface ProjectTreeNode {
    $id: string;
    name: string;
    projects?: ProjectTreeNode[];
}