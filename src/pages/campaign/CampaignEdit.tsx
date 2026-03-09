import { useParams, Link } from "react-router-dom";
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
import Logo from "@/components/Logo";
import LoadingPopup from "@/components/LoadingPopup";
import usePermissions from "@/hooks/usePermissions";

const LottieWrapper = lazy(() => import("@/components/LottieWrapper"));

const CampaignUpdateSuccess = (c: Campaign) => {
    return (
        <Paper sx={{ padding: 2, textAlign: 'center', borderRadius: 7, maxWidth: 800, mx: 'auto', my: 4 }}>
            <Logo />
            <LottieWrapper src='/lottie/success.lottie' marginTop="-1em" />
            <Typography variant="h6" sx={{ mb: 2, textAlign: 'center', mt: -3 }} color='success'>
                Campaign Updated Successfully
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 2, textAlign: 'center' }}>
                Campaign <b>{c.name}</b> has been updated.
            </Typography>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
                <Link to={`/campaign/${c.campaignId}`}>
                    <Button variant="contained" color="primary" endIcon={<ArrowForward />} sx={{ borderRadius: 7, mb: 2, mt: 1, px: 2, py: 1 }}>
                        Go to Campaign
                    </Button>
                </Link>
            </div>
        </Paper>
    );
};

const EditCampaignForm = ({ initialCampaign }: { initialCampaign: CampaignUpdate }) => {
    const { t } = useTranslation();
    const [error, setError] = useState<Error | null>(null);
    const [campaign, campaignDispatch] = useReducer(campaignReducer, initialCampaign);
    const { data: updatedCampaign = null, trigger, isMutating: loading } = useSWRMutation<Campaign | undefined>(
        `/api/campaign/${initialCampaign.campaignId}`,
        () => updateCampaign(campaign as CampaignUpdate),
        { onError: setError }
    );

    if (updatedCampaign) {
        return <CampaignUpdateSuccess {...updatedCampaign} />;
    }

    return (
        <div className="p-2 px-3 rounded-2xl w-full max-w-4xl relative h-max bg-[#fefdfd6e] dark:bg-[#1f1f1f] m-auto" style={{ marginTop: 16, marginBottom: 16 }}>
            <Logo />
            <Typography variant="h3" sx={{ mb: 4, textAlign: 'center', fontSize: { xs: 24, sm: 48 } }}>
                {t('campaign.updateCampaign')}
            </Typography>
            {loading && <LoadingPopup />}
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
        return <Skeleton variant="rectangular" width="100%" height={400} sx={{ m: 1 }} />;
    }

    if (!campaignResponse) return null;
    if ('detail' in campaignResponse) {
        return <div>{t(campaignResponse.detail)}</div>;
    }

    const campaign = campaignResponse.data;
    const { canEditCampaignInProject } = usePermissions();

    if (!canEditCampaignInProject(campaign.projectId)) {
        return <div>{t('error.onlyAdminOrProjectLeadCanEdit')}</div>;
    }

    const initialCampaign: CampaignUpdate = {
        ...campaign,
        coordinators: campaign.coordinators || []
    };

    return (
        <div style={{
            display: 'flex',
            width: '100%', height: '100vh',
            justifyContent: 'center', alignItems: 'center',
            backgroundImage: "url('/snowy-hill.svg')",
            backgroundRepeat: 'repeat-y',
            backgroundSize: 'cover',
        }}>
            <div style={{
                width: '100%', height: '100%',
                display: 'flex',
                backgroundColor: 'rgba(255,255,255,0.4)',
                justifyContent: 'center', alignItems: 'center',
            }}>
                <EditCampaignForm initialCampaign={initialCampaign} />
            </div>
        </div>
    );
}

export default CampaignEditPage
