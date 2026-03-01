import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { useReducer, useState } from "react";
import { fetchAPIFromBackendSingleWithErrorHandling } from "@/api";
import { updateCampaign } from "@/api/campaign";
import type { Campaign } from "@/types/campaign";
import { campaignReducer, type CampaignUpdate } from "@/types/campaign/create";
import CampaignEditForm from "@/components/campaign/CampaignEditForm";
import ReturnButton from "@/components/ReturnButton";
import { Button, LinearProgress, Skeleton, Typography } from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";

const EditCampaignForm = ({ initialCampaign }: { initialCampaign: CampaignUpdate }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [error, setError] = useState<Error | null>(null);
    const [campaign, campaignDispatch] = useReducer(campaignReducer, initialCampaign);
    const { trigger, isMutating: loading } = useSWRMutation<Campaign | undefined>(
        `/api/campaign/${initialCampaign.campaignId}`,
        () => updateCampaign(campaign as CampaignUpdate),
        {
            onError: setError,
            onSuccess: () => navigate(`/campaign/${initialCampaign.campaignId}`),
        }
    );

    return (
        <div className="p-2 px-3 rounded-2xl w-full max-w-4xl relative h-max bg-[#fefdfd6e] dark:bg-[#1f1f1f] m-auto" style={{ marginTop: 16, marginBottom: 16 }}>
            <Typography variant="h3" sx={{ mb: 4, textAlign: 'center', fontSize: { xs: 24, sm: 48 } }}>
                {t('campaign.updateCampaign')}
            </Typography>
            {loading && <LinearProgress sx={{ mb: 2 }} />}
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
        return (
            <>
                <Header returnTo="/" />
                <Skeleton variant="rectangular" width="100%" height={400} sx={{ m: 1 }} />
            </>
        );
    }

    if (!campaignResponse) return null;
    if ('detail' in campaignResponse) {
        return (
            <>
                <Header returnTo="/" />
                <Typography sx={{ m: 2 }}>{t(campaignResponse.detail)}</Typography>
            </>
        );
    }

    const campaign = campaignResponse.data;
    const initialCampaign: CampaignUpdate = {
        ...campaign,
        coordinators: campaign.coordinators || []
    };

    return (
        <>
            <Header returnTo={`/campaign/${campaignId}`} />
            <EditCampaignForm initialCampaign={initialCampaign} />
            <Footer />
        </>
    );
}

export default CampaignEditPage
