import { TextField } from "@mui/material";
import { type ActionDispatch, useState } from "react";
import UserInput from "../user/UserInput";
import type { ProjectCreate } from "@/types/project";
import ImageInput from "./ImageInput";

const LogoHeight = 100;
const LogoWidth = 100;

const ProjectEditForm = ({ dispatch, loading, disabled = false, autoSuggestId = true, disableId, ...project }: ProjectCreate & {
    dispatch: ActionDispatch<[Partial<ProjectCreate>]>,
    loading: boolean,
    disabled?: boolean,
    autoSuggestId: boolean,
    disableId: boolean
}) => {
    const [isDirtyByUser, setIsDirtyByUser] = useState(false);
    return (
        <div>
            <TextField
                label="Name"
                variant="outlined"
                sx={{ mb: 2, width: '100%' }}
                onChange={(e) => {
                    dispatch({ name: e.target.value })
                    if (!isDirtyByUser && autoSuggestId) {
                        dispatch({ projectId: e.target.value.toLowerCase().replace(/[^a-z0-9অ-ঔ০-৯]/g, '-').substring(0, 50) })
                    }
                }}
                value={project.name}
                disabled={loading || disabled}
            />
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, flexFlow: 'wrap' }}>
                <TextField
                    label="Project Code"
                    variant="outlined"
                    sx={{ mb: 1, width: { xs: '100%', sm: '49%' } }}
                    onChange={(e) => {
                        setIsDirtyByUser(true)
                        dispatch({ projectId: e.target.value })
                    }}
                    value={project.projectId}
                    disabled={loading || disabled || disableId}
                />
                <TextField
                    label="Website"
                    variant="outlined"
                    sx={{ mb: 1, width: { xs: '100%', sm: '49%' } }}
                    onChange={(e) => dispatch({ url: e.target.value })}
                    value={project.url || ''}
                    disabled={loading || disabled}
                />
            </div>
            <UserInput
                value={project.projectLeads}
                onChange={(projectLeads) => dispatch({ projectLeads })}
                label="Project Leads"
                disabled={loading || disabled}
                sx={{ mb: 2 }}
            />
            <ImageInput
                value={project.logoUrl}
                onChange={(logoUrl) => dispatch({ logoUrl })}
                label="Logo"
                disabled={loading || disabled}
                sx={{ mb: 2 }}
                height={LogoHeight}
                width={LogoWidth}
            />
        </div>
    );
}

export default ProjectEditForm;
