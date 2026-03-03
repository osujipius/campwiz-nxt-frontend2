import { useTranslation } from "react-i18next";
import useSWR from "swr";
import { fetchAPIFromBackendSingleWithErrorHandling } from "@/api";
import type { Project } from "@/types/project";
import { Button, Skeleton, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import SingleProjectChip from "@/components/project/SingleProjectChip";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import useSession from "@/hooks/useSession";
import { Link } from "react-router-dom";

const ProjectListPage = () => {
    const { t } = useTranslation();
    const session = useSession();
    const sessionProjectId = session?.projectId ?? null;

    const { data: projectsResponse, isLoading: listLoading } = useSWR(
        '/project?includeRoles=true',
        fetchAPIFromBackendSingleWithErrorHandling<Project[]>
    );

    const projects = (projectsResponse && !('detail' in projectsResponse)) ? projectsResponse.data : [];
    const myProjectInList = projects.find(project => project.projectId === sessionProjectId);

    const { data: ownProjectResponse, isLoading: ownLoading } = useSWR(
        !myProjectInList && sessionProjectId ? `/project/${sessionProjectId}?includeProjectLeads=true` : null,
        fetchAPIFromBackendSingleWithErrorHandling<Project>
    );

    const canAccessOtherProject = session && (session.permission & session.permissionMap.PermissionOtherProjectAccess) === session.permissionMap.PermissionOtherProjectAccess;

    if (listLoading || ownLoading) {
        return (
            <>
                <Header returnTo="/" />
                <Skeleton variant="rectangular" width="100%" height={400} sx={{ m: 1 }} />
            </>
        );
    }

    if (!projectsResponse) return null;
    if ('detail' in projectsResponse) {
        return (
            <>
                <Header returnTo="/" />
                <Typography sx={{ m: 2 }}>{t(projectsResponse.detail)}</Typography>
            </>
        );
    }

    const myProject = myProjectInList
        ?? (ownProjectResponse && !('detail' in ownProjectResponse) ? ownProjectResponse.data : null);
    const otherProjects = projects.filter(project => project.projectId !== sessionProjectId);

    return (
        <>
            <Header returnTo="/" />
            <div style={{ padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h4" fontWeight="bold">{t("project.dashboard")}</Typography>
                    {canAccessOtherProject && (
                        <Link to="/project/new">
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                sx={{
                                    bgcolor: "#006699",
                                    color: "#fff",
                                    borderRadius: 30,
                                    m: 1,
                                    px: 2,
                                    transition: "0.3s",
                                    "&:hover": {
                                        bgcolor: "#00557d",
                                        transform: "scale(1.05)",
                                    },
                                }}
                            >
                                {t('project.createProject')}
                            </Button>
                        </Link>
                    )}
                </div>

                {myProject && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, padding: 20 }}>
                        <Typography variant="h5" fontWeight="bold" sx={{ width: '100%' }}>{t('project.myProject')}</Typography>
                        <SingleProjectChip project={myProject} />
                    </div>
                )}

                {!myProject && !otherProjects.length && (
                    <Typography variant="body1" sx={{ textAlign: 'center', mt: 4, color: 'text.secondary' }}>
                        {t('error.loadingProjects')}
                    </Typography>
                )}

                {otherProjects.length > 0 && (
                    <>
                        <Typography variant="h5" fontWeight="bold" sx={{ textAlign: 'center', p: 2 }}>
                            {t('project.otherProjects')}
                        </Typography>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, padding: 20 }}>
                            {otherProjects.map(project => (
                                <SingleProjectChip key={project.projectId} project={project} />
                            ))}
                        </div>
                    </>
                )}
            </div>
            <Footer />
        </>
    );
}

export default ProjectListPage;
