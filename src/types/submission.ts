import type { EvaluationType } from './round'
import type { ResponseList } from './response'

export interface Submission {
    submissionId: string
    title: string
    campaignId: string
    url: string
    author: string
    submittedById: string
    participantId: string
    currentRoundId: string
    submittedAt: string
    createdAtServer: string
    mediatype: string
    thumburl: string
    thumbwidth: number
    thumbheight: number
    license: string
    description: string
    creditHTML: string
    metadata?: unknown
    width: number
    height: number
    duration: number
    bitrate: number
    size: number
}

export interface Evaluation {
    evaluationId: string
    submissionId: string
    judgeId: string
    participantId: string
    roundId: string
    type: EvaluationType
    score: number
    comment: string
    serial: number
    submission: Submission | null
    createdAt: string
    updatedAt: string
    evaluatedAt: string
    skipExpirationAt: string
    distributionTaskId: string
}

export type EvaluationListResponseWithCurrentStats = ResponseList<Evaluation> & {
    totalEvaluatedCount: number
    totalAssignmentCount: number
}

export type Category = {
    name: string
    fixed: boolean
}

export type SubmissionWithCategories = Submission & {
    categories: Category[]
}
