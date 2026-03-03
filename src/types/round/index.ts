import type { Role } from "../role";
import { RoundStatus } from "./status";

export const MediaType = {
    AUDIO: 'AUDIO',
    VIDEO: 'VIDEO',
    IMAGE: 'BITMAP',
    ARTICLE: 'ARTICLE',
    DRAWING: 'DRAWING',
} as const;

export type MediaType = typeof MediaType[keyof typeof MediaType];

export const EvaluationType = {
    BINARY: 'binary',
    RANKING: 'ranking',
    SCORE: 'score',
} as const;

export type EvaluationType = typeof EvaluationType[keyof typeof EvaluationType];

type RoundCommonRestrictions = {
    allowJuryToParticipate: boolean
    allowMultipleJudgement: boolean
    secretBallot: boolean
    blacklist: string
}

type RoundAudioRestrictions = {
    audioMinimumDurationMilliseconds: number
    audioMinimumSizeBytes: number
}

export type RoundVideoRestrictions = {
    videoMinimumDurationMilliseconds: number
    videoMinimumSizeBytes: number
    videoMinimumResolution: number
}

type RoundImageRestrictions = {
    imageMinimumResolution: number
    imageMinimumSizeBytes: number
}

export type RoundArticleRestrictions = {
    maximumSubmissionOfSameArticle: number
    articleAllowExpansions: boolean
    articleAllowCreations: boolean
    articleMinimumTotalBytes: number
    articleMinimumTotalWords: number
    articleMinimumAddedBytes: number
    articleMinimumAddedWords: number
}

export type RoundMediaRestrictions = RoundImageRestrictions & RoundAudioRestrictions & RoundVideoRestrictions

type RoundRestrictions = RoundCommonRestrictions & RoundMediaRestrictions & RoundArticleRestrictions & {
    allowedMediaTypes: MediaType[]
}

export type RoundWritable = {
    name: string
    description: string
    startDate: string
    endDate: string
    isOpen: boolean
    isPublicJury: boolean
    dependsOnRoundId?: string
    serial: number
    type: EvaluationType
    quorum: number
} & RoundRestrictions

export type RoundCreate = {
    campaignId: string
    jury: string[]
} & RoundWritable

export interface Round extends RoundWritable {
    roundId: string
    campaignId: string
    createdAt?: string
    createdById: string
    totalSubmissions: number
    totalEvaluatedSubmissions: number
    totalEvaluatedAssignments: number
    totalAssignments: number
    status: RoundStatus
    latestDistributionTaskId?: string
    roles: Role[] | null
    jury: { [k: string]: string } | null
}

export interface SubmissionResultSummary {
    readonly averageScore: number
    submissionCount: number
}

export interface SubmissionResult {
    readonly author: string
    readonly juryCount: number
    readonly name: string
    readonly score: number
    readonly submissionId: string
    readonly type: string
}
