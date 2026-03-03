import { Button, CircularProgress, Paper, Typography } from "@mui/material";
import { lazy, useReducer, useState } from "react";
import useSWRMutation from "swr/mutation";
import { Link } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import ForwardIcon from '@mui/icons-material/ArrowForward';
import ProjectEditForm from "@/components/project/ProjectEditForm";
import ReturnButton from "@/components/ReturnButton";
import type { Project } from "@/types/project";
import { initialProjectCreate, projectCreateReducer } from "@/types/project";
import { createProject } from "@/api/project";
import Logo from "@/components/Logo";
import LoadingPopup from "@/components/LoadingPopup";

const LottieWrapper = lazy(() => import("@/components/LottieWrapper"));

const ProjectCreationSuccess = (c: Project & { reset: () => void }) => {
    return (
        <Paper sx={{ padding: 2, textAlign: 'center', borderRadius: 7, maxWidth: 800, mx: 'auto', my: 4 }}>
            <img src='/logo.svg' alt="Logo" width={100} height={100} style={{ margin: 'auto' }} />
            <LottieWrapper src='/lottie/success.lottie' marginTop="-1em" />
            <Typography variant="h6" sx={{ mb: 2, textAlign: 'center', mt: -3 }} color='success'>
                Project Created Successfully
            </Typography>
            <Typography variant="subtitle1" sx={{ textAlign: 'center' }}>
                Project {c.name} has been created with id <b>{c.projectId}</b>
            </Typography>
            <Typography variant="subtitle1" sx={{ textAlign: 'center' }}>
                Project Leads: {c.projectLeads.map((lead, i) => <b key={i}>{lead}</b>)}
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
                {createdProject ? <ProjectCreationSuccess {...createdProject} reset={reset} /> :
                    <Paper sx={{
                        padding: 2, px: 3, width: '100%', maxWidth: 800,
                        position: 'absolute',
                        top: '50%', left: '50%',
                        transform: 'translate(-50%,-50%)',
                        borderRadius: 6,
                    }}>
                        <Logo />
                        <Typography variant="h3" sx={{ mb: 4, textAlign: 'center', fontSize: { xs: 24, sm: 48 } }}>
                            Create Project
                        </Typography>
                        {loading && <LoadingPopup src="/lottie/creating.lottie" />}
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
                            >
                                <CircularProgress size={24} color="inherit" sx={{ display: loading ? 'inline-block' : 'none', mr: 1 }} />
                                Create Project
                            </Button>
                        </div>
                    </Paper>
                }
            </div>
        </div>
    );
}

export default ProjectCreatePage;
