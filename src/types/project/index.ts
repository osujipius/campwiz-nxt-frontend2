export interface Project {
    logoUrl: string;
    name: string;
    projectId: string;
    projectLeads: string[];
    url: string;
}

export type ProjectCreate = Project;

export type ProjectUpdate = Project & { projectLeads: string[] };

export const initialProjectCreate: ProjectCreate = {
    logoUrl: "",
    name: "",
    projectId: "",
    projectLeads: [],
    url: ""
}

export const projectCreateReducer = (state: ProjectCreate, action: Partial<ProjectCreate>) => {
    return {
        ...state,
        ...action
    }
}

export const projectUpdateReducer = (state: ProjectUpdate, action: Partial<ProjectUpdate>) => {
    return {
        ...state,
        ...action
    }
}
