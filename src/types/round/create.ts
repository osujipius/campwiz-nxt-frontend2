import { EvaluationType, MediaType, type RoundCreate } from "."

export const initialRoundCreate: RoundCreate = {
    allowedMediaTypes: [MediaType.IMAGE, MediaType.AUDIO, MediaType.VIDEO],
    type: EvaluationType.BINARY,
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    name: "",
    description: "",
    isPublicJury: false,
    allowJuryToParticipate: true,
    campaignId: "",
    jury: [],
    isOpen: false,
    serial: 0,
    allowMultipleJudgement: true,
    secretBallot: true,
    blacklist: "",
    audioMinimumDurationMilliseconds: 0,
    audioMinimumSizeBytes: 0,
    videoMinimumDurationMilliseconds: 0,
    videoMinimumSizeBytes: 0,
    videoMinimumResolution: 0,
    imageMinimumResolution: 2000000,
    imageMinimumSizeBytes: 0,
    maximumSubmissionOfSameArticle: 1,
    articleAllowExpansions: true,
    articleAllowCreations: true,
    articleMinimumTotalBytes: 0,
    articleMinimumTotalWords: 0,
    articleMinimumAddedBytes: 0,
    articleMinimumAddedWords: 0,
    quorum: 1,
}

export const roundCreateReducer = (state: RoundCreate, action: Partial<RoundCreate>) => {
    return { ...state, ...action }
}

export type RoundCreateAction = Partial<RoundCreate>
export type RoundCreateDispatch = (action: RoundCreateAction) => void
