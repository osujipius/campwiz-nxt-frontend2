import { fetchAPIFromBackendListWithErrorHandling, fetchAPIFromBackendSingleWithErrorHandling } from '@/api'
import type { Evaluation, EvaluationListResponseWithCurrentStats } from '@/types/submission'
import type { ResponseError } from '@/types/response'

type EvaluationFilter = {
    roundId: string
    includeSkipped?: boolean
    limit: number
    next?: string
    prev?: string
    includeSubmissions?: boolean
    isPublic: boolean
    includeEvaluated?: boolean
    includeNonEvaluated?: boolean
    randomize?: boolean
}

export const loadNextEvaluation = async ({
    roundId,
    includeSkipped,
    limit,
    next,
    prev,
    includeSubmissions,
    isPublic,
    includeEvaluated,
    includeNonEvaluated,
    randomize,
}: EvaluationFilter): Promise<EvaluationListResponseWithCurrentStats | ResponseError | null> => {
    const qs = new URLSearchParams({ roundId })

    if (includeSkipped) qs.append('includeSkipped', includeSkipped.toString())
    if (limit) qs.append('limit', limit.toString())
    if (next) qs.append('next', next)
    if (prev) qs.append('prev', prev)
    if (includeSubmissions) qs.append('includeSubmission', includeSubmissions.toString())
    if (isPublic) qs.append('isPublic', isPublic.toString())
    if (typeof includeEvaluated !== 'undefined') qs.append('includeEvaluated', includeEvaluated.toString())
    if (typeof includeNonEvaluated !== 'undefined') qs.append('includeNonEvaluated', includeNonEvaluated.toString())
    if (typeof randomize !== 'undefined') qs.append('randomize', String(randomize))

    const url = (isPublic ? `/round/${roundId}/next/public` : `/evaluation/`) + `?${qs.toString()}`
    const response = await fetchAPIFromBackendListWithErrorHandling<Evaluation>(url)
    if (!response) return null
    if ('detail' in response) return response
    return response as EvaluationListResponseWithCurrentStats
}

type Vote = {
    score: number
    comment: string | null
    submissionId?: string
    evaluationId?: string
    description?: string | null
    thumbURL?: string | null
}

export const submitVote = async (roundId: string, isPublicJury: boolean, votes: Vote[]) => {
    let url = `/evaluation/`
    if (isPublicJury) {
        url = `/evaluation/public/${roundId}`
    }
    const resp = await fetchAPIFromBackendSingleWithErrorHandling(url, {
        method: 'POST',
        body: JSON.stringify(votes),
    })
    return resp
}

export const fetchEvaluation = async (evaluationId: string) => {
    return fetchAPIFromBackendSingleWithErrorHandling<Evaluation>(
        `/evaluation/${evaluationId}/?includeSubmissions=true&includeEvaluated=true`
    )
}
