import { fetchAPIFromBackendSingleWithErrorHandling } from "@/api";
import type { Campaign } from "@/types/campaign";
import type { CampaignCreate, CampaignUpdate } from "@/types/campaign/create";
import type { ResponseError, ResponseSingle } from "@/types/response";
import type { RoundStatus } from "@/types/round/status";

export const loadCampaigns = async (path: string, qs: string): Promise<Campaign[] | ResponseError | null> => {
    const url = path + '?' + qs;
    const response = await fetchAPIFromBackendSingleWithErrorHandling<Campaign[]>(url);
    if (!response) return null;
    if ('detail' in response) return response as ResponseError;
    return response.data;
}

export const updateCampaign = async (campaign: CampaignUpdate): Promise<Campaign> => {
    if (campaign.name === '') throw new Error('Campaign name cannot be empty');
    if (campaign.description === '') throw new Error('Campaign description cannot be empty');
    if (campaign.startDate === '') throw new Error('Campaign start date cannot be empty');
    if (campaign.endDate === '') throw new Error('Campaign end date cannot be empty');
    if (campaign.coordinators.length === 0) throw new Error('At least one coordinator is required');
    if (campaign.language === '') throw new Error('You must select a language. If it is wikimedia Commons, select "commons"');

    const payload = {
        ...campaign,
        coordinators: campaign.coordinators.map((c) => typeof c === 'string' ? c : c.username),
    };
    const res = await fetchAPIFromBackendSingleWithErrorHandling<Campaign>(`/campaign/${campaign.campaignId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    if ('detail' in res) throw new Error(res.detail);
    return res.data;
}

export const updateCampaignStatus = async (campaignId: string, isArchived: boolean): Promise<ResponseSingle<Campaign> | ResponseError> => {
    return fetchAPIFromBackendSingleWithErrorHandling<Campaign>(`/campaign/${campaignId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isArchived }),
    });
}

export const updateRoundStatus = async (roundId: string, status: RoundStatus) => {
    return fetchAPIFromBackendSingleWithErrorHandling(`/round/${roundId}/status`, {
        method: 'POST',
        body: JSON.stringify({ status }),
    });
}

export const deleteRound = async (roundId: string) => {
    return fetchAPIFromBackendSingleWithErrorHandling<{ roundId: string }>(`/round/${roundId}`, {
        method: 'DELETE',
    });
}

export const addMyselfAsPublicJury = async (roundId: string) => {
    return fetchAPIFromBackendSingleWithErrorHandling(`/round/${roundId}/addMyselfAsPublicJury`, {
        method: 'POST',
    });
}

export const createCampaign = async (campaign: CampaignCreate): Promise<Campaign> => {
    if (campaign.name === '') throw new Error('Campaign name cannot be empty');
    if (campaign.description === '') throw new Error('Campaign description cannot be empty');
    if (campaign.startDate === '') throw new Error('Campaign start date cannot be empty');
    if (campaign.endDate === '') throw new Error('Campaign end date cannot be empty');
    if (campaign.coordinators.length === 0) throw new Error('At least one coordinator is required');
    if (campaign.language === '') throw new Error('You must select a language. If it is wikimedia Commons, select "commons"');

    const payload = {
        ...campaign,
        coordinators: campaign.coordinators.map((c) => typeof c === 'string' ? c : c.username),
    };
    const res = await fetchAPIFromBackendSingleWithErrorHandling<Campaign>(`/campaign/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    if ('detail' in res) throw new Error(res.detail);
    return res.data;
}
