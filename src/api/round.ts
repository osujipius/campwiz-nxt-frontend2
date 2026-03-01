import { fetchAPIFromBackendSingleWithErrorHandling, fetchFromBackend } from "@/api";
import type { Round, RoundCreate, SubmissionResultSummary } from "@/types/round";
import type { Task } from "@/types/task";
import type { SubmissionWithCategories, Submission } from "@/types/submission";

export const createRound = async (round: RoundCreate) => {
    return fetchAPIFromBackendSingleWithErrorHandling<Round>('/round/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(round),
    });
}

export const updateRound = async (roundId: string, round: RoundCreate) => {
    return fetchAPIFromBackendSingleWithErrorHandling<Round>(`/round/${roundId}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(round),
    });
}

export const startImportFromCommons = async (roundId: string, categories: string[]) => {
    const data = { categories: categories.map((c) => c.replace(/^(?:Category:)?/, 'Category:')) };
    return fetchAPIFromBackendSingleWithErrorHandling<Task>(`/round/import/${roundId}/commons`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export const startImportFromRound = async (roundId: string, dependedOnRoundId: string, scores: string[]) => {
    const data = { roundId: dependedOnRoundId, scores: scores.map(s => parseFloat(s)) };
    return fetchAPIFromBackendSingleWithErrorHandling<Task>(`/round/import/${roundId}/previous`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export const fetchRoundResults = async (url: string) => {
    const resp = await fetchAPIFromBackendSingleWithErrorHandling<(SubmissionResultSummary & { cumulative: number })[]>(url);
    if ('data' in resp) {
        const summary = resp.data;
        let cumulative = 0;
        for (let i = 0; i < summary.length; i++) {
            cumulative += summary[i].submissionCount;
            summary[i].cumulative = cumulative;
        }
        resp.data = summary;
    }
    return resp;
}

export const startDistributionTask = async (roundId: string, juries: string[]) => {
    return fetchAPIFromBackendSingleWithErrorHandling<Task>(`/round/distribute/${roundId}`, {
        method: 'POST',
        body: JSON.stringify({ juries }),
    });
}

export const getUncategorizedSubmissions = async (campaignId: string) => {
    return fetchAPIFromBackendSingleWithErrorHandling<Submission[]>(`/category/uncategorized/${campaignId}`);
}

export const updateSubmissionCategories = async (submissionId: string, categories: string[], summary: string) => {
    return fetchAPIFromBackendSingleWithErrorHandling<SubmissionWithCategories>(`/category/${submissionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categories, summary }),
    });
}

export const exportRoundResultsCSV = async (roundId: string) => {
    const API_PATH = import.meta.env.VITE_BACKEND_API_PATH || '/api/v2';
    const res = await fetchFromBackend(`${API_PATH}/round/${roundId}/results/csv`, {
        headers: { 'Content-Type': 'text/csv', 'Accept': 'text/csv' },
        method: 'GET',
    });
    return res;
}
