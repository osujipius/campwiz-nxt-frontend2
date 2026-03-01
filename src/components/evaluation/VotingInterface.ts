import type { Evaluation } from '@/types/submission'

export type VotingInterfaceProps = {
    goNext: () => void
    goPrevious: () => void
    submitScore: (score: number) => Promise<void>
    onSkip?: () => void
    saving: boolean
    evaluation: Evaluation
    noPrevious?: boolean
    noNext?: boolean
    assignmnetCount: number
    evaluationCount: number
    showProgress?: boolean
}
