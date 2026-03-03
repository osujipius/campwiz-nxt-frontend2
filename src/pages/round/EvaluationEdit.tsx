import { useParams, useSearchParams, Link } from 'react-router-dom'
import { fetchAPIFromBackendSingleWithErrorHandling } from '@/api'
import { fetchEvaluation, submitVote } from '@/api/evaluation'
import { EvaluationType } from '@/types/round'
import type { Round } from '@/types/round'
import type { Evaluation, EvaluationListResponseWithCurrentStats, Submission } from '@/types/submission'
import { useEffect, useState } from 'react'
import LinearProgress from '@mui/material/LinearProgress'
import { Button } from '@mui/material'
import TickIcon from '@mui/icons-material/CheckCircle'
import EditIcon from '@mui/icons-material/Edit'
import ArrowBackward from '@mui/icons-material/ArrowBack'
import Header from '@/components/home/Header'
import ScoreOrBinaryVotingInterface from '@/components/evaluation/BinaryOrScoreVotingInterface'

const SavingSuccess = ({ returnTo, close }: { returnTo: string; close: () => void }) => (
    <div className="flex flex-col items-center justify-center h-screen">
        <TickIcon className="text-green-500" fontSize="large" />
        <div className="text-lg mt-4">Your vote has been saved successfully.</div>
        <Link to={returnTo} className="mt-4 text-blue-500 hover:underline">
            <Button
                variant="contained"
                color="primary"
                startIcon={<ArrowBackward />}
                sx={{ borderRadius: 3, m: 1 }}
            >
                Go to the List
            </Button>
        </Link>
        <Button
            variant="outlined"
            color="secondary"
            startIcon={<EditIcon />}
            sx={{ borderRadius: 3, m: 1 }}
            onClick={close}
        >
            Modify Again
        </Button>
    </div>
)

const EvaluationEditPage = () => {
    const { roundId, evaluationId } = useParams<{ roundId: string; evaluationId: string }>()
    const [searchParams] = useSearchParams()
    const returnTo = searchParams.get('back') || `/round/${roundId}/submission/evaluated`

    const [round, setRound] = useState<Round | null>(null)
    const [evaluation, setEvaluation] = useState<Evaluation | null>(null)
    const [submission, setSubmission] = useState<Submission | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [imageLoaded, setImageLoaded] = useState(true)
    const [saving, setSaving] = useState(false)
    const [assignmentCount, setAssignmentCount] = useState(0)
    const [evaluationCount, setEvaluationCount] = useState(0)
    const [showProgress, setShowProgress] = useState(false)
    const [showResponse, setShowResponse] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [_skipCount, setSkipCount] = useState(0)

    useEffect(() => {
        if (!roundId || !evaluationId) return

        const fetchData = async () => {
            setLoading(true)
            const roundResp = await fetchAPIFromBackendSingleWithErrorHandling<Round>(`/round/${roundId}/`)
            if (!roundResp) {
                setError('Round not found')
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

            if (!([EvaluationType.BINARY, EvaluationType.SCORE] as string[]).includes(r.type)) {
                setError('Sorry, Only Yes/No and Rating evaluation types are supported for modification.')
                setLoading(false)
                return
            }

            const evalResp = await fetchEvaluation(evaluationId)
            if (!evalResp) {
                setError('Evaluation not found')
                setLoading(false)
                return
            }
            if ('detail' in evalResp) {
                setError(evalResp.detail)
                setLoading(false)
                return
            }
            const ev = evalResp.data
            if (!ev) {
                setError('Evaluation not found')
                setLoading(false)
                return
            }
            if (!ev.submission) {
                setError('Submission not found')
                setLoading(false)
                return
            }
            setEvaluation(ev)
            setSubmission(ev.submission)
            setLoading(false)
        }

        fetchData()
    }, [roundId, evaluationId])

    const submit = async (score: number) => {
        if (!round || !evaluation) return
        try {
            if (saving) return
            if (!imageLoaded) return
            setSaving(true)
            const response = await submitVote(round.roundId, false, [
                {
                    evaluationId: evaluation.evaluationId,
                    score,
                    comment: null,
                    submissionId: evaluation.submissionId,
                },
            ])
            if (!response) {
                setSubmitError('Something went wrong')
                return
            }
            if ('detail' in response) {
                setSubmitError(response.detail)
                return
            }
            const r = response as EvaluationListResponseWithCurrentStats
            setAssignmentCount(r.totalAssignmentCount)
            setEvaluationCount(r.totalEvaluatedCount)
            setShowProgress(true)
            setImageLoaded(true)
            setShowResponse(true)
        } catch (error) {
            setSubmitError((error as Error).message)
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <LinearProgress />
    if (error) return (
        <>
            <Header returnTo={round ? `/campaign/${round.campaignId}` : undefined} />
            <p className="text-center text-red-500">{error}</p>
        </>
    )
    if (!round || !evaluation || !submission) return null

    if (!saving && showResponse) {
        return (
            <>
                <Header returnTo={returnTo} />
                <SavingSuccess
                    returnTo={returnTo}
                    close={() => {
                        setShowResponse(false)
                        setShowProgress(false)
                        setImageLoaded(true)
                    }}
                />
            </>
        )
    }

    return (
        <ScoreOrBinaryVotingInterface
            assignmentCount={assignmentCount}
            campaignId={round.campaignId}
            currentCursor={0}
            imageLoaded={imageLoaded}
            setImageLoaded={setImageLoaded}
            currentEvaluation={evaluation}
            isPublicJury={round.isPublicJury}
            error={submitError}
            evaluationCount={evaluationCount}
            isLoading={false}
            nextImageWrapper={() => setImageLoaded(true)}
            saving={saving}
            setCurrentCursor={() => {}}
            submission={submission}
            submit={submit}
            returnTo={returnTo}
            hasNext={false}
            showProgress={showProgress}
            noHeader={false}
            onSkip={() => setSkipCount((s) => s + 1)}
        />
    )
}

export default EvaluationEditPage
