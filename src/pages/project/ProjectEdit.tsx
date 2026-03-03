import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { lazy, useReducer, useState } from "react";
import { fetchAPIFromBackendSingleWithErrorHandling } from "@/api";
import { updateProject } from "@/api/project";
import type { Project, ProjectUpdate } from "@/types/project";
import { projectUpdateReducer } from "@/types/project";
import ProjectEditForm from "@/components/project/ProjectEditForm";
import ReturnButton from "@/components/ReturnButton";
import { Button, Paper, Skeleton, Typography } from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import ArrowForward from "@mui/icons-material/ArrowForward";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import LoadingPopup from "@/components/LoadingPopup";

const LottieWrapper = lazy(() => import("@/components/LottieWrapper"));

const ProjectUpdateSuccess = (c: Project) => {
    const { t } = useTranslation();
    return (
        <Paper sx={{ padding: 2, textAlign: 'center', borderRadius: 7, maxWidth: 800, mx: 'auto', my: 4 }}>
            <img src='/logo.svg' alt="Logo" width={100} height={100} style={{ margin: 'auto' }} />
            <LottieWrapper src='/lottie/success.lottie' marginTop="-1em" />
            <Typography variant="h6" sx={{ mb: 2, textAlign: 'center', mt: -3 }} color='success'>
                {t('project.updateSuccess')}
            </Typography>
            <Typography variant="subtitle1" sx={{ textAlign: 'center' }}>
                {t('project.updateSuccessDetail', { name: c.name, projectId: c.projectId })}
            </Typography>
            <Typography variant="subtitle1" sx={{ textAlign: 'center' }}>
                {t('project.leads')}: {c.projectLeads.map((lead, i) => <b key={i}>{lead}</b>)}
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 2, textAlign: 'center' }}>
                {t('project.leadsCanCreateCampaigns')}
            </Typography>
            <Link to={`/project/${c.projectId}`}>
                <Button variant="contained" color="success" endIcon={<ArrowForward />} sx={{ borderRadius: 7, mb: 2, mt: 1 }}>
                    {t('project.goToProject')}
                </Button>
            </Link>
        </Paper>
    )
}

const EditProjectForm = ({ initialProject }: { initialProject: ProjectUpdate }) => {
    const { t } = useTranslation();
    const [error, setError] = useState<Error | null>(null);
    const [project, projectDispatch] = useReducer(projectUpdateReducer, initialProject);
    const { data: updatedProject = null, trigger, isMutating: loading } = useSWRMutation<Project | undefined>(
        `/api/project/${initialProject.projectId}`,
        () => updateProject(project as ProjectUpdate),
        { onError: setError }
    );

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex',
            justifyContent: 'center', alignItems: 'center',
            backgroundImage: `url(/red-hill.svg)`,
            backgroundSize: 'cover',
        }}>
            <div style={{
                position: 'relative', width: '100%', height: '100%', display: 'flex',
                backgroundColor: 'rgba(255,255,255,0.4)',
                justifyContent: 'center', alignItems: 'center',
            }}>
                {updatedProject ? <ProjectUpdateSuccess {...updatedProject} /> :
                    <Paper sx={{
                        padding: 2, px: 3, width: '100%', maxWidth: 800,
                        position: 'absolute',
                        top: '50%', left: '50%',
                        transform: 'translate(-50%,-50%)',
                        borderRadius: 6,
                    }}>
                        <Logo />
                        <Typography variant="h3" sx={{ mb: 4, textAlign: 'center', fontSize: { xs: 24, sm: 48 } }}>
                            {t('project.updateProject')}
                        </Typography>
                        {loading && <LoadingPopup src="/lottie/creating.lottie" />}
                        <ProjectEditForm {...project} loading={loading} dispatch={projectDispatch} disableId autoSuggestId={false} />
                        {error && <Typography variant="body1" color="error" sx={{ mb: 1 }}>{error.message}</Typography>}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                            <ReturnButton disabled={loading} sx={{ m: 0, borderRadius: 10, px: 2 }} />
                            <Button
                                onClick={() => trigger().catch(setError)}
                                variant="contained"
                                color="success"
                                disabled={loading}
                                sx={{ borderRadius: 10 }}
                                startIcon={<SaveIcon />}
                                loading={loading}
                            >
                                {t('project.updateProject')}
                            </Button>
                        </div>
                    </Paper>}
            </div>
        </div>
    );
}

const ProjectEditPage = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const { t } = useTranslation();

    const { data: projectResponse, isLoading } = useSWR(
        projectId ? `/project/${projectId}?includeProjectLeads=true` : null,
        fetchAPIFromBackendSingleWithErrorHandling<Project>
    );

    if (isLoading) {
        return <Skeleton variant="rectangular" width="100%" height="100vh" />;
    }

    if (!projectResponse) return null;
    if ('detail' in projectResponse) {
        return <Typography sx={{ m: 2 }}>{t(projectResponse.detail)}</Typography>;
    }

    const project = projectResponse.data;
    const initialProject: ProjectUpdate = {
        ...project,
        projectLeads: project.projectLeads || [],
    };

    return <EditProjectForm initialProject={initialProject} />;
}

export default ProjectEditPage;
