import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { lazy, useReducer, useState } from "react";
import { fetchAPIFromBackendSingleWithErrorHandling } from "@/api";
import { updateCampaign } from "@/api/campaign";
import type { Campaign } from "@/types/campaign";
import { campaignReducer, type CampaignUpdate } from "@/types/campaign/create";
import CampaignEditForm from "@/components/campaign/CampaignEditForm";
import ReturnButton from "@/components/ReturnButton";
import { Button, Paper, Skeleton, Typography } from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import ArrowForward from "@mui/icons-material/ArrowForward";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import LoadingPopup from "@/components/LoadingPopup";

const LottieWrapper = lazy(() => import("@/components/LottieWrapper"));

const CampaignUpdateSuccess = (c: Campaign) => {
    const { t } = useTranslation();
    return (
        <Paper sx={{ padding: 2, textAlign: 'center', borderRadius: 7, maxWidth: 800, mx: 'auto', my: 4 }}>
            <img src='/logo.svg' alt="Logo" width={100} height={100} style={{ margin: 'auto' }} />
            <LottieWrapper src='/lottie/success.lottie' marginTop="-1em" />
            <Typography variant="h6" sx={{ mb: 2, textAlign: 'center', mt: -3 }} color='success'>
                {t('campaign.updateSuccess')}
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 2, textAlign: 'center' }}>
                {t('campaign.updateSuccessDetail', { name: c.name })}
            </Typography>
            <Link to={`/campaign/${c.campaignId}`}>
                <Button variant="contained" color="primary" endIcon={<ArrowForward />} sx={{ borderRadius: 7, mb: 2, mt: 1, px: 2, py: 1 }}>
                    {t('campaign.goToCampaign')}
                </Button>
            </Link>
        </Paper>
    )
}

const EditCampaignForm = ({ initialCampaign }: { initialCampaign: CampaignUpdate }) => {
    const { t } = useTranslation();
    const [error, setError] = useState<Error | null>(null);
    const [campaign, campaignDispatch] = useReducer(campaignReducer, initialCampaign);
    const { data: updatedCampaign = null, trigger, isMutating: loading } = useSWRMutation<Campaign | undefined>(
        `/api/campaign/${initialCampaign.campaignId}`,
        () => updateCampaign(campaign as CampaignUpdate),
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
                {updatedCampaign ? <CampaignUpdateSuccess {...updatedCampaign} /> :
                    <div className="p-2 px-3 rounded-2xl w-full max-w-4xl relative h-max m-auto"
                        style={{ backgroundColor: 'rgba(248,246,246,0.8)' }}>
                        <Logo />
                        <Typography variant="h3" sx={{ mb: 4, textAlign: 'center', fontSize: { xs: 24, sm: 48 } }}>
                            {t('campaign.updateCampaign')}
                        </Typography>
                        {loading && <LoadingPopup src="/lottie/creating.lottie" />}
                        <CampaignEditForm {...campaign} loading={loading} dispatch={campaignDispatch} disableOnPrivate t={t} />
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
                                {t('campaign.updateCampaign')}
                            </Button>
                        </div>
                    </div>}
            </div>
        </div>
    );
}

const CampaignEditPage = () => {
    const { campaignId } = useParams<{ campaignId: string }>();
    const { t } = useTranslation();

    const { data: campaignResponse, isLoading } = useSWR(
        campaignId ? `/campaign/${campaignId}?includeRoles=true` : null,
        fetchAPIFromBackendSingleWithErrorHandling<Campaign>
    );

    if (isLoading) {
        return <Skeleton variant="rectangular" width="100%" height="100vh" />;
    }

    if (!campaignResponse) return null;
    if ('detail' in campaignResponse) {
        return <Typography sx={{ m: 2 }}>{t(campaignResponse.detail)}</Typography>;
    }

    const campaign = campaignResponse.data;
    const initialCampaign: CampaignUpdate = {
        ...campaign,
        coordinators: campaign.coordinators || []
    };

    return <EditCampaignForm initialCampaign={initialCampaign} />;
}

export default CampaignEditPage
