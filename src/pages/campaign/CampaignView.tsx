import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useSWR from "swr";
import { fetchAPIFromBackendSingleWithErrorHandling } from "@/api";
import type { Campaign, WikimediaUsername } from "@/types/campaign";
import { Chip, Paper, Skeleton, Typography } from "@mui/material";
import DateRangeIcon from '@mui/icons-material/DateRange';
import RuleIcon from '@mui/icons-material/Rule';
import Description from "@/components/round/Description";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import EditButton from "@/components/campaign/EditButton";
import ArchiveUnArchiveButton from "@/components/campaign/ArchiveUnArchiveButton";
import useSession from "@/hooks/useSession";
import usePermissions from "@/hooks/usePermissions";
import RoundTimeline from "@/components/campaign/RoundTimeline";

const CoordinatorList = ({ coordinators }: { coordinators: WikimediaUsername[] | null }) => {
    const { t } = useTranslation();
    if (!coordinators) return <Typography variant="h4">{t('error.noCoordinators')}</Typography>
    return (
        <Typography variant="h6">
            {t('campaign.coordinators')}: &nbsp;
            {coordinators.map((c, i) => (
                <Chip key={i} label={typeof c === 'string' ? c : c.username} sx={{ m: 0.5 }} />
            ))}
        </Typography>
    )
}

const CampaignViewPage = () => {
    const { campaignId } = useParams<{ campaignId: string }>();
    const { t } = useTranslation();
    const { session } = useSession();
    const { isAdmin } = usePermissions();

    const qs = new URLSearchParams({
        includeRoles: 'true',
        includeProject: 'true',
        includeRounds: 'true',
        includeRoundRoles: 'true',
    }).toString();

    const { data: campaignResponse, isLoading } = useSWR(
        campaignId ? `/campaign/${campaignId}/?${qs}` : null,
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
    const isArchived = campaign.archivedAt !== null;
    const canAccessOtherProject = isAdmin;
    const canUpdate = canAccessOtherProject || session?.projectId === campaign.projectId;
    const canArchive = session?.projectId === campaign.projectId;
    const isCoordinator = campaign.coordinators?.some(
        (c) => (typeof c === 'string' ? c : c.username) === session?.username
    ) === true;

    return (
        <>
            <Header returnTo="/" />
            <Paper sx={{ p: { xs: 1, sm: 2 }, m: 1 }}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Typography variant="h4" sx={{ overflowWrap: 'anywhere' }}>
                        {campaign.name}
                        <Typography variant="subtitle1" color="textDisabled" component='b' sx={{ display: 'inline' }}>
                            ({campaign.campaignId})
                        </Typography>
                    </Typography>
                    <div>
                        {canArchive && (
                            <ArchiveUnArchiveButton
                                campaignId={campaign.campaignId}
                                isArchived={isArchived}
                                campaignName={campaign.name}
                            />
                        )}
                        {!isArchived && canUpdate && (
                            <EditButton campaignId={campaign.campaignId} />
                        )}
                    </div>
                </div>
                <br />
                <Description
                    description={`${new Date(campaign.startDate).toDateString()} - ${new Date(campaign.endDate).toDateString()}`}
                    label={t('campaign.duration')}
                    Icon={DateRangeIcon}
                />
                <Description description={campaign.description} label={t('campaign.description')} />
                <Description description={campaign.rules} label={t('campaign.rules')} Icon={RuleIcon} />
                <CoordinatorList coordinators={campaign.coordinators} />
                <br />
                <RoundTimeline
                    rounds={campaign.rounds}
                    campaign={campaign}
                    session={session}
                    isCoordinator={isCoordinator}
                    isArchived={isArchived}
                />
            </Paper>
            <Footer />
        </>
    );
}

export default CampaignViewPage
