import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { lazy, useReducer, useState } from "react";
import { fetchAPIFromBackendSingleWithErrorHandling } from "@/api";
import { createCampaign } from "@/api/campaign";
import type { Project } from "@/types/project";
import type { Campaign } from "@/types/campaign";
import { campaignReducer, initialCampaignCreate } from "@/types/campaign/create";
import CampaignEditForm from "@/components/campaign/CampaignEditForm";
import ReturnButton from "@/components/ReturnButton";
import { Button, LinearProgress, Paper, Skeleton, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import ArrowForward from "@mui/icons-material/ArrowForward";
import { Link } from "react-router-dom";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import Logo from "@/components/Logo";
import usePermissions from "@/hooks/usePermissions";

const LottieWrapper = lazy(() => import("@/components/LottieWrapper"));

const CampaignCreationSuccess = (c: Campaign) => {
    return (
        <Paper sx={{ padding: 2, textAlign: 'center', borderRadius: 7, maxWidth: 800, mx: 'auto', my: 4 }}>
            <Logo />
            <LottieWrapper src='/lottie/success.lottie' marginTop="-1em" />
            <Typography variant="h6" sx={{ mb: 2, textAlign: 'center', mt: -3 }} color='success'>
                Campaign Created Successfully
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 2, textAlign: 'center' }}>
                Campaign {c.name} has been created with id{' '}
                <Typography variant="body1" component="b" color='primary' sx={{ fontWeight: 'bold' }}>{c.campaignId}</Typography>
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 2, textAlign: 'center' }}>
                Now, would you like to create a round for this campaign?
                Your organizers can create rounds for this campaign, too.
                Please let them know the details.
            </Typography>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, maxWidth: 400, margin: '0 auto' }}>
                <ReturnButton sx={{ borderRadius: 7, px: 2 }} />
                <Link to={`/campaign/${c.campaignId}`}>
                    <Button variant="contained" color="primary" endIcon={<ArrowForward />} sx={{ borderRadius: 7, mb: 2, mt: 1, mr: 2, px: 2, py: 1 }}>
                        Go to Campaign
                    </Button>
                </Link>
            </div>
        </Paper>
    )
}

const CampaignCreateForm = ({ projectLeads, projectId }: { projectLeads: string[], projectId: string }) => {
    const { t } = useTranslation();
    const [error, setError] = useState<Error | null>(null);
    const [campaign, campaignDispatch] = useReducer(campaignReducer, { ...initialCampaignCreate, coordinators: projectLeads.map(l => ({ username: l, userId: '' })), projectId });
    const { data: createdCampaign = null, trigger, isMutating: loading } = useSWRMutation<Campaign | undefined>(
        '/api/campaign',
        () => createCampaign(campaign),
        { onError: setError }
    );

    return createdCampaign ? <CampaignCreationSuccess {...createdCampaign} /> : (
        <div className="p-2 px-3 rounded-2xl w-full max-w-4xl relative h-max bg-[#fefdfd6e] dark:bg-[#1f1f1f] m-auto" style={{ marginTop: 16, marginBottom: 16 }}>
            <Typography variant="h3" sx={{ mb: 4, textAlign: 'center', fontSize: { xs: 24, sm: 48 } }}>
                {t('campaign.createCampaign')}
            </Typography>
            {loading && <LinearProgress sx={{ mb: 2 }} />}
            <CampaignEditForm {...campaign} loading={loading} dispatch={campaignDispatch} t={t} />
            {error && <Typography variant="body1" color="error" sx={{ mb: 1 }}>{t(error.message)}</Typography>}
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
                    {t('campaign.createCampaign')}
                </Button>
            </div>
        </div>
    );
}

const CampaignCreatePage = () => {
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
    const projectLeads = project.projectLeads || [];
    const { canAccessProject } = usePermissions();

    if (!canAccessProject(projectId!)) {
        return (
            <>
                <Header returnTo={`/project/${projectId}`} />
                <Typography sx={{ m: 2 }}>{t('error.accessDeniedToProject')}</Typography>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header returnTo={`/project/${projectId}`} />
            <div style={{
                backgroundImage: "url('/snowy-hill.svg')",
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
                    <CampaignCreateForm projectLeads={projectLeads} projectId={projectId!} />
                </div>
            </div>
            <Footer />
        </>
    );
}

export default CampaignCreatePage;
