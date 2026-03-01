import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useSWR from "swr";
import { fetchAPIFromBackendSingleWithErrorHandling } from "@/api";
import type { Project } from "@/types/project";
import type { Campaign } from "@/types/campaign";
import {
    Typography, Container, Card, CardContent, Button, Box, Chip, Skeleton,
} from "@mui/material";
import { ArrowForward, Add } from "@mui/icons-material";
import SettingsIcon from '@mui/icons-material/Settings';
import ArchiveIcon from "@mui/icons-material/Archive";
import { Link } from "react-router-dom";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import NokiberButton from "@/components/NokiberButton";
import useSession from "@/hooks/useSession";

const ProjectViewPage = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const { t } = useTranslation();
    const session = useSession();

    const { data: projectResponse, isLoading: projectLoading } = useSWR(
        projectId ? `/project/${projectId}?includeProjectLeads=true` : null,
        fetchAPIFromBackendSingleWithErrorHandling<Project>
    );

    const { data: campaignsResponse, isLoading: campaignsLoading } = useSWR(
        projectId ? `/campaign/?projectId=${projectId}` : null,
        fetchAPIFromBackendSingleWithErrorHandling<Campaign[]>
    );

    const canAccessOtherProject = session && (session.permission & session.permissionMap.PermissionOtherProjectAccess) === session.permissionMap.PermissionOtherProjectAccess;

    if (projectLoading || campaignsLoading) {
        return (
            <>
                <Header returnTo="/project" />
                <Skeleton variant="rectangular" width="100%" height={400} sx={{ m: 1 }} />
            </>
        );
    }

    if (!projectResponse) return null;
    if ('detail' in projectResponse) {
        return (
            <>
                <Header returnTo="/project" />
                <Typography sx={{ m: 2 }}>{t(projectResponse.detail)}</Typography>
            </>
        );
    }

    const project = projectResponse.data;
    const projectLeads = project.projectLeads || [];

    const campaigns = (campaignsResponse && !('detail' in campaignsResponse))
        ? [...campaignsResponse.data].sort((a, b) => b.campaignId.localeCompare(a.campaignId))
        : [];

    return (
        <>
            <Header returnTo="/project" />
            <div style={{ display: "flex", minHeight: "100vh", backgroundColor: 'transparent' }}>
                <Box component="main" sx={{ flexGrow: 1, p: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Container sx={{
                        my: 1, textAlign: "center", bgcolor: "primary.paper",
                        p: 2, borderRadius: 3, boxShadow: 3,
                        transition: "0.3s", "&:hover": { boxShadow: 6 },
                        display: 'block'
                    }} component='div'>
                        <img
                            src={project.logoUrl}
                            alt={project.name}
                            width={100}
                            height={100}
                            style={{ display: 'block', margin: 'auto' }}
                        />
                        <Typography variant="h4" fontWeight="bold" sx={{ fontFamily: "Lora, serif" }}>
                            {t('project.welcomeToProject', { project: project.name })}
                        </Typography>
                        {canAccessOtherProject && (
                            <Link to={`/project/${projectId}/edit`}>
                                <Button
                                    variant="outlined"
                                    sx={{ mt: 1, borderRadius: 30, transition: "0.3s" }}
                                    endIcon={<SettingsIcon />}
                                >
                                    {t('project.editProject')}
                                </Button>
                            </Link>
                        )}
                        <br />
                        {projectLeads.map((lead) => (
                            <Chip label={lead} sx={{ mt: 2, borderRadius: 30, transition: "0.3s" }} key={lead} />
                        ))}
                    </Container>

                    <Container>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h5" sx={{ fontWeight: "bold", fontFamily: "Lora, serif" }}>
                                {t('campaign.activeCampaigns')}
                            </Typography>
                            <NokiberButton
                                variant="outlined"
                                sx={{ borderRadius: 30 }}
                                startIcon={<ArchiveIcon />}
                                color="secondary"
                                link={`/campaign?isClosed=true&projectId=${projectId}`}
                                label={t('campaign.archivedCampaigns')}
                            />
                            <NokiberButton
                                variant="contained"
                                sx={{ borderRadius: 30 }}
                                startIcon={<Add />}
                                label={t('campaign.createCampaign')}
                                link={`/project/${projectId}/new`}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                            {campaigns.length === 0 && (
                                <Typography variant="h5" sx={{ fontWeight: "bold", fontFamily: "Lora, serif" }}>
                                    {t('error.noRunningCampaigns')}
                                </Typography>
                            )}
                            {campaigns.map((campaign) => (
                                <Card key={campaign.campaignId} sx={{
                                    borderRadius: 3, boxShadow: 3,
                                    transition: "0.3s",
                                    "&:hover": { boxShadow: 6, transform: "scale(1.05)" },
                                    width: { xs: '100%', sm: 'calc(50% - 24px)', md: 'calc(33.33% - 24px)' },
                                }}>
                                    <CardContent sx={{ textAlign: "center" }}>
                                        <Typography variant="h6" fontWeight="bold" sx={{ fontFamily: "Lora, serif" }}>
                                            {campaign.name}
                                        </Typography>
                                        <Typography variant="body2" color="gray">
                                            Date: {new Date(campaign.startDate).toUTCString()} - {new Date(campaign.endDate).toUTCString()}
                                        </Typography>
                                        <Link to={`/campaign/${campaign.campaignId}`}>
                                            <Button
                                                variant="outlined"
                                                sx={{
                                                    mt: 1, borderRadius: 30,
                                                    transition: "0.3s",
                                                    "&:hover": { transform: "scale(1.05)" },
                                                }}
                                                endIcon={<ArrowForward />}
                                            >
                                                {t('campaign.goToCampaign')}
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    </Container>
                </Box>
            </div>
            <Footer />
        </>
    );
};

export default ProjectViewPage;
