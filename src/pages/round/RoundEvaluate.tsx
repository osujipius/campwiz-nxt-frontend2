import { useParams } from 'react-router-dom'
import { fetchAPIFromBackendSingleWithErrorHandling } from '@/api'
import { loadNextEvaluation } from '@/api/evaluation'
import { EvaluationType } from '@/types/round'
import type { Round } from '@/types/round'
import type { EvaluationListResponseWithCurrentStats } from '@/types/submission'
import { lazy, Suspense, useEffect, useState } from 'react'
import LinearProgress from '@mui/material/LinearProgress'
import Header from '@/components/home/Header'

const EvaluationManager = lazy(() => import('@/components/evaluation/EvaluationManager'))
const RankingVotingInterface = lazy(() => import('@/components/evaluation/RankingVotingInterface'))

const RankingBatchSize = 20

const RoundEvaluatePage = () => {
    const { roundId } = useParams<{ roundId: string }>()
    const [round, setRound] = useState<Round | null>(null)
    const [evaluationResponse, setEvaluationResponse] = useState<EvaluationListResponseWithCurrentStats | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!roundId) return

        const fetchData = async () => {
            setLoading(true)
            const roundResp = await fetchAPIFromBackendSingleWithErrorHandling<Round>(`/round/${roundId}/`)
            if (!roundResp) {
                setError('Failed to load round')
                setLoading(false)
                return
            }
            if ('detail' in roundResp) {
                setError(roundResp.detail)
                setLoading(false)
                return
            }
            const r = roundResp.data
            setRound(r)

            const limit = r.type === EvaluationType.RANKING ? RankingBatchSize : 5
            const evalResp = await loadNextEvaluation({
                roundId: r.roundId,
                limit,
                includeSubmissions: true,
                isPublic: r.isPublicJury,
                includeEvaluated: false,
            })
            if (!evalResp) {
                setError('Failed to load evaluations')
                setLoading(false)
                return
            }
            if ('detail' in evalResp) {
                setError(evalResp.detail)
                setLoading(false)
                return
            }
            setEvaluationResponse(evalResp as EvaluationListResponseWithCurrentStats)
            setLoading(false)
        }

        fetchData()
    }, [roundId])

    if (loading) return <LinearProgress />
    if (error) return (
        <>
            <Header />
            <p className="text-center text-red-500">Error: {error}</p>
        </>
    )
    if (!round || !evaluationResponse) return null

    return (
        <Suspense fallback={<LinearProgress />}>
            {[EvaluationType.BINARY, EvaluationType.SCORE].includes(round.type) && (
                <EvaluationManager
                    isPublicJury={round.isPublicJury}
                    roundId={round.roundId}
                    initailEvaluations={evaluationResponse.data}
                    next={evaluationResponse.next}
                    campaignId={round.campaignId}
                    limit={1}
                    evaluationCount={evaluationResponse.totalEvaluatedCount}
                    assignmentCount={evaluationResponse.totalAssignmentCount}
                />
            )}
            {round.type === EvaluationType.RANKING && (
                <RankingVotingInterface
                    roundId={round.roundId}
                    initailEvaluations={evaluationResponse.data}
                    next={evaluationResponse.next}
                    campaignId={round.campaignId}
                    limit={RankingBatchSize}
                    isPublicJury={round.isPublicJury}
                />
            )}
        </Suspense>
    )
}

export default RoundEvaluatePage
