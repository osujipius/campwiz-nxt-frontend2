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
import { Button, CircularProgress, Paper, Skeleton, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import ArrowForward from "@mui/icons-material/ArrowForward";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import LoadingPopup from "@/components/LoadingPopup";

const LottieWrapper = lazy(() => import("@/components/LottieWrapper"));

const CampaignCreationSuccess = (c: Campaign) => {
    return (
        <Paper sx={{ padding: 2, textAlign: 'center', borderRadius: 7, maxWidth: 800, mx: 'auto', my: 4 }}>
            <img src='/logo.svg' alt="Logo" width={100} height={100} style={{ margin: 'auto' }} />
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

    return (
        <div style={{
            display: 'flex',
            width: '100%', minHeight: '100vh',
            justifyContent: 'center', alignItems: 'center',
            backgroundImage: `url(/snowy-hill.svg)`,
            backgroundRepeat: 'repeat-y',
            backgroundSize: 'cover',
        }}>
            <div style={{
                width: '100%', display: 'flex', minHeight: '100vh',
                backgroundColor: 'rgba(255,255,255,0.4)',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                {createdCampaign ? <CampaignCreationSuccess {...createdCampaign} /> :
                    <div className="p-2 px-3 rounded-2xl w-full max-w-4xl relative h-max m-auto"
                        style={{ backgroundColor: 'rgba(248,246,246,0.8)' }}>
                        <Logo />
                        <Typography variant="h3" sx={{ mb: 4, textAlign: 'center', fontSize: { xs: 24, sm: 48 } }}>
                            {t('campaign.createCampaign')}
                        </Typography>
                        {loading && <LoadingPopup src="/lottie/creating.lottie" />}
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
                            >
                                <CircularProgress size={24} color="inherit" sx={{ display: loading ? 'inline-block' : 'none', mr: 1 }} />
                                {t('campaign.createCampaign')}
                            </Button>
                        </div>
                    </div>}
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
        return <Skeleton variant="rectangular" width="100%" height="100vh" />;
    }

    if (!projectResponse) return null;
    if ('detail' in projectResponse) {
        return <Typography sx={{ m: 2 }}>{t(projectResponse.detail)}</Typography>;
    }

    const project = projectResponse.data;
    const projectLeads = project.projectLeads || [];

    return <CampaignCreateForm projectLeads={projectLeads} projectId={projectId!} />;
}

export default CampaignCreatePage;
