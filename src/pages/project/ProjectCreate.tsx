import { Button, LinearProgress, Paper, Typography } from "@mui/material";
import { lazy, useReducer, useState } from "react";
import useSWRMutation from "swr/mutation";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AddIcon from '@mui/icons-material/Add';
import ForwardIcon from '@mui/icons-material/ArrowForward';
import ProjectEditForm from "@/components/project/ProjectEditForm";
import ReturnButton from "@/components/ReturnButton";
import type { Project } from "@/types/project";
import { initialProjectCreate, projectCreateReducer } from "@/types/project";
import { createProject } from "@/api/project";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import Logo from "@/components/Logo";
import usePermissions from "@/hooks/usePermissions";

const LottieWrapper = lazy(() => import("@/components/LottieWrapper"));

const ProjectCreationSuccess = (c: Project & { reset: () => void }) => {
    return (
        <Paper sx={{ padding: 2, textAlign: 'center', borderRadius: 7, maxWidth: 800, mx: 'auto', my: 4 }}>
            <Logo />
            <LottieWrapper src='/lottie/success.lottie' marginTop="-1em" />
            <Typography variant="h6" sx={{ mb: 2, textAlign: 'center', mt: -3 }} color='success'>
                Project Created Successfully
            </Typography>
            <Typography variant="subtitle1" sx={{ textAlign: 'center' }}>
                Project {c.name} has been created with id <b>{c.projectId}</b>
            </Typography>
            <Typography variant="subtitle1" sx={{ textAlign: 'center' }}>
                Project Leads: {c.projectLeads.map((lead, i) => <b key={i}>{lead} </b>)}
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 2, textAlign: 'center' }}>
                The project leads can now create campaigns for this project.
            </Typography>
            <Button variant="contained" color="primary" onClick={c.reset} sx={{ mr: 2, borderRadius: 7, mb: 2, mt: 1 }} startIcon={<AddIcon />}>
                Create Another Project
            </Button>
            <Link to={`/project/${c.projectId}`}>
                <Button variant="contained" color="success" endIcon={<ForwardIcon />} sx={{ borderRadius: 7, mb: 2, mt: 1 }}>
                    Go to Project
                </Button>
            </Link>
        </Paper>
    )
}

const ProjectCreatePage = () => {
    const { t } = useTranslation();
    const { canAccessOtherProject } = usePermissions();
    const [error, setError] = useState<Error | null>(null);
    const [project, projectDispatch] = useReducer(projectCreateReducer, initialProjectCreate);
    const { data: createdProject = null, trigger, isMutating: loading, reset: resetMutation } = useSWRMutation<Project | undefined>(
        '/api/project',
        () => createProject(project),
        { onError: setError }
    );
    const reset = () => {
        projectDispatch(initialProjectCreate);
        resetMutation();
    }

    if (!canAccessOtherProject) {
        return (
            <>
                <Header returnTo="/project" />
                <Typography sx={{ m: 2 }}>{t('error.notAllowedToCreateProject')}</Typography>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header returnTo="/project" />
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
            {createdProject ? <ProjectCreationSuccess {...createdProject} reset={reset} /> : (
                <div className="p-2 px-3 rounded-2xl w-full max-w-4xl relative h-max bg-[#fefdfd6e] dark:bg-[#1f1f1f] m-auto" style={{ marginTop: 16, marginBottom: 16 }}>
                    <Typography variant="h3" sx={{ mb: 4, textAlign: 'center', fontSize: { xs: 24, sm: 48 } }}>
                        {t('project.createProject')}
                    </Typography>
                    {loading && <LinearProgress sx={{ mb: 2 }} />}
                    <ProjectEditForm {...project} loading={loading} dispatch={projectDispatch} disableId={false} autoSuggestId />
                    {error && <Typography variant="body1" color="error" sx={{ mb: 1 }}>{error.message}</Typography>}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                        <ReturnButton disabled={loading} sx={{ m: 0, borderRadius: 10, px: 2 }} />
                        <Button
                            onClick={() => trigger().catch(setError)}
                            variant="contained"
                            color="success"
                            disabled={loading}
                            sx={{ borderRadius: 10 }}
                            startIcon={<AddIcon />}
                            loading={loading}
                        >
                            {t('project.createProject')}
                        </Button>
                    </div>
                </div>
            )}
                </div>
            </div>
            <Footer />
        </>
    );
}

export default ProjectCreatePage;
