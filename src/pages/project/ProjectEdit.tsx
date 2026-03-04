import { useParams, Link } from "react-router-dom";
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
import { Button, LinearProgress, Paper, Skeleton, Typography } from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import ArrowForward from "@mui/icons-material/ArrowForward";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import Logo from "@/components/Logo";
import usePermissions from "@/hooks/usePermissions";

const LottieWrapper = lazy(() => import("@/components/LottieWrapper"));

const ProjectUpdateSuccess = (c: Project) => {
    return (
        <Paper sx={{ padding: 2, textAlign: 'center', borderRadius: 7, maxWidth: 800, mx: 'auto', my: 4 }}>
            <Logo />
            <LottieWrapper src='/lottie/success.lottie' marginTop="-1em" />
            <Typography variant="h6" sx={{ mb: 2, textAlign: 'center', mt: -3 }} color='success'>
                Project Updated Successfully
            </Typography>
            <Typography variant="subtitle1" sx={{ textAlign: 'center' }}>
                Project <b>{c.name}</b> has been updated with id <b>{c.projectId}</b>
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 2, textAlign: 'center' }}>
                Project Leads: {c.projectLeads.map((lead, i) => <b key={i}>{lead} </b>)}
            </Typography>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
                <Link to={`/project/${c.projectId}`}>
                    <Button variant="contained" color="success" endIcon={<ArrowForward />} sx={{ borderRadius: 7, mb: 2, mt: 1 }}>
                        Go to Project
                    </Button>
                </Link>
            </div>
        </Paper>
    );
};

const EditProjectForm = ({ initialProject }: { initialProject: ProjectUpdate }) => {
    const { t } = useTranslation();
    const [error, setError] = useState<Error | null>(null);
    const [project, projectDispatch] = useReducer(projectUpdateReducer, initialProject);
    const { data: updatedProject = null, trigger, isMutating: loading } = useSWRMutation<Project | undefined>(
        `/api/project/${initialProject.projectId}`,
        () => updateProject(project as ProjectUpdate),
        { onError: setError }
    );

    if (updatedProject) {
        return <ProjectUpdateSuccess {...updatedProject} />;
    }

    return (
        <div className="p-2 px-3 rounded-2xl w-full max-w-4xl relative h-max bg-[#fefdfd6e] dark:bg-[#1f1f1f] m-auto" style={{ marginTop: 16, marginBottom: 16 }}>
            <Typography variant="h3" sx={{ mb: 4, textAlign: 'center', fontSize: { xs: 24, sm: 48 } }}>
                {t('project.editProject')}
            </Typography>
            {loading && <LinearProgress sx={{ mb: 2 }} />}
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
                    {t('project.editProject')}
                </Button>
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
        return (
            <>
                <Header returnTo={`/project/${projectId}`} />
                <Skeleton variant="rectangular" width="100%" height={400} sx={{ m: 1 }} />
            </>
        );
    }

    if (!projectResponse) return null;
    if ('detail' in projectResponse) {
        return (
            <>
                <Header returnTo={`/project/${projectId}`} />
                <Typography sx={{ m: 2 }}>{t(projectResponse.detail)}</Typography>
            </>
        );
    }

    const project = projectResponse.data;
    const { canAccessProject } = usePermissions();

    if (!canAccessProject(projectId!)) {
        return (
            <>
                <Header returnTo={`/project/${projectId}`} />
                <Typography sx={{ m: 2 }}>{t('error.notAllowedToAccessProject')}</Typography>
                <Footer />
            </>
        );
    }

    const initialProject: ProjectUpdate = {
        ...project,
        projectLeads: project.projectLeads || [],
    };

    return (
        <>
            <Header returnTo={`/project/${projectId}`} />
            <div style={{
                backgroundImage: "url('/red-hill.svg')",
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                minHeight: 'calc(100vh - 128px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <div style={{
                    backgroundColor: 'rgba(255,255,255,0.4)',
                    width: '100%',
                    minHeight: 'calc(100vh - 128px)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <EditProjectForm initialProject={initialProject} />
                </div>
            </div>
            <Footer />
        </>
    );
}

export default ProjectEditPage;
