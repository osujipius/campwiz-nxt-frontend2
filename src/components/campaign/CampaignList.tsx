import SingleCampaignChip from "@/components/campaign/SingleCampaignChip"
import { fetchAPIFromBackendSingleWithErrorHandling } from "@/api"
import type { Campaign } from "@/types/campaign"
import { Skeleton } from "@mui/material"
import useSWR from "swr"

type CListProps = {
    limit: number
    isClosed?: boolean
    isHidden?: boolean
    sortOrder: string
    projectId?: string
}

export const formQs = (isClosed: boolean | undefined, isHidden: boolean | undefined, limit: number, sortOrder: string, projectId?: string) => {
    const searchParams = new URLSearchParams();
    if (limit !== 0) {
        searchParams.set('limit', String(limit));
    }
    if (isClosed !== undefined) {
        searchParams.set('isClosed', String(isClosed));
    }
    if (isHidden !== undefined) {
        searchParams.set('isHidden', String(isHidden));
    }
    if (sortOrder !== undefined) {
        searchParams.set('sortOrder', sortOrder);
    }
    if (projectId !== undefined) {
        searchParams.set('projectId', projectId);
    }
    return searchParams.toString();
}

const CList = ({ isClosed, isHidden, limit, sortOrder, projectId }: CListProps) => {
    const qs = formQs(isClosed, isHidden, limit, sortOrder, projectId);
    const { data: campaignResponse, error, isLoading } = useSWR('/campaign/?' + qs, fetchAPIFromBackendSingleWithErrorHandling<Campaign[]>);

    if (isLoading) return <Skeleton variant="rectangular" width='100%' height={200} />
    if (error) return <p>Error: {error.message}</p>
    if (!campaignResponse) return null;
    if ('detail' in campaignResponse) return <p>Error: {campaignResponse.detail}</p>

    const campaigns = campaignResponse.data;
    return campaigns.map((campaign) => (
        <SingleCampaignChip
            campaign={campaign}
            key={campaign.campaignId}
        />
    ))
}

export default CList
