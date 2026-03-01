import { fetchAPIFromBackendSingleWithErrorHandling } from "@/api";
import type { Project, ProjectCreate, ProjectUpdate } from "@/types/project";
import type { ResponseError, ResponseSingle } from "@/types/response";

export const loadProjects = async (path: string): Promise<Project[] | ResponseError | null> => {
    const response = await fetchAPIFromBackendSingleWithErrorHandling<Project[]>(path);
    if (!response) return null;
    if ('detail' in response) return response as ResponseError;
    return response.data;
}

export const loadProject = async (projectId: string): Promise<ResponseSingle<Project> | ResponseError> => {
    return fetchAPIFromBackendSingleWithErrorHandling<Project>(`/project/${projectId}?includeProjectLeads=true`);
}

export const createProject = async (project: ProjectCreate): Promise<Project> => {
    if (project.name === '') throw new Error('Project name cannot be empty');
    if (project.logoUrl === '') throw new Error('Project logo cannot be empty');
    if (project.url === '') throw new Error('Project website cannot be empty');
    if (project.projectId === '') throw new Error('Project code cannot be empty');
    if (project.projectLeads.length === 0) throw new Error('At least one coordinator is required');

    const res = await fetchAPIFromBackendSingleWithErrorHandling<Project>('/project/?includeProjectLeads=true', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
    });
    if ('detail' in res) throw new Error(res.detail);
    return res.data;
}

export const updateProject = async (project: ProjectUpdate): Promise<Project> => {
    if (project.name === '') throw new Error('Project name cannot be empty');
    if (project.logoUrl === '') throw new Error('Project logo cannot be empty');
    if (project.url === '') throw new Error('Project website cannot be empty');
    if (project.projectId === '') throw new Error('Project code cannot be empty');
    if (project.projectLeads.length === 0) throw new Error('At least one coordinator is required');

    const res = await fetchAPIFromBackendSingleWithErrorHandling<Project>(`/project/${project.projectId}?includeProjectLeads=true`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
    });
    if ('detail' in res) throw new Error(res.detail);
    return res.data;
}
