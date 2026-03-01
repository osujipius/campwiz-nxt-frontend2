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

export type Category = {
    name: string
    fixed: boolean
}

export type SubmissionWithCategories = Submission & {
    categories: Category[]
}
