import { useParams, useSearchParams, Link, useLocation } from 'react-router-dom'
import { fetchAPIFromBackendSingleWithErrorHandling } from '@/api'
import { loadNextEvaluation } from '@/api/evaluation'
import { EvaluationType } from '@/types/round'
import type { Round } from '@/types/round'
import type { Evaluation, EvaluationListResponseWithCurrentStats, Submission } from '@/types/submission'
import { useEffect, useState } from 'react'
import LinearProgress from '@mui/material/LinearProgress'
import {
    Button,
    Dialog,
    DialogActions,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import CancelIcon from '@mui/icons-material/Cancel'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import EditIcon from '@mui/icons-material/Edit'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import InformationIcon from '@mui/icons-material/Info'
import CloseIcon from '@mui/icons-material/Close'
import Header from '@/components/home/Header'
import SubmissionDetails from '@/components/submission/SubmissionDetails'
import { useTranslation } from 'react-i18next'

const Score = ({ evType, score }: { evType: EvaluationType; score: number }) => {
    if (score === null) return null
    if (evType === EvaluationType.BINARY) {
        return score === 0 ? (
            <CancelIcon sx={{ fontSize: 40, color: 'red' }} />
        ) : (
            <CheckCircleIcon sx={{ fontSize: 40, color: 'green' }} />
        )
    }
    if (evType === EvaluationType.SCORE) {
        const count = score / 20
        return (
            <>
                {Array.from({ length: 5 }, (_, i) =>
                    i < count ? (
                        <FavoriteIcon key={i} color="error" />
                    ) : (
                        <FavoriteBorderIcon key={i} color="error" />
                    )
                )}
            </>
        )
    }
    return null
}

const RoundEvaluatedPage = () => {
    const { roundId } = useParams<{ roundId: string }>()
    const [searchParams] = useSearchParams()
    const location = useLocation()
    const { t } = useTranslation()

    const [round, setRound] = useState<Round | null>(null)
    const [evaluations, setEvaluations] = useState<Evaluation[]>([])
    const [nextToken, setNextToken] = useState<string | undefined>(undefined)
    const [prevToken, setPrevToken] = useState<string | undefined>(undefined)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)

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

            if (!([EvaluationType.BINARY, EvaluationType.SCORE] as string[]).includes(r.type)) {
                setError('Sorry, Only Yes/No and Rating evaluation types are supported for modification.')
                setLoading(false)
                return
            }

            const cursor = searchParams.get('next') || undefined
            const prevCursor = searchParams.get('prev') || undefined
            const evalResp = await loadNextEvaluation({
                roundId: r.roundId,
                limit: 20,
                includeSubmissions: true,
                isPublic: false,
                includeEvaluated: true,
                includeNonEvaluated: false,
                next: cursor,
                prev: prevCursor,
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
            const data = evalResp as EvaluationListResponseWithCurrentStats
            setEvaluations(data.data)
            setNextToken(data.next)
            setPrevToken(data.prev)
            setLoading(false)
        }

        fetchData()
    }, [roundId, searchParams])

    if (loading) return <LinearProgress />
    if (error) return (
        <>
            <Header returnTo={round ? `/campaign/${round.campaignId}` : undefined} />
            <p className="text-center text-red-500">{error}</p>
        </>
    )
    if (!round) return null

    return (
        <>
            <Header returnTo={`/campaign/${round.campaignId}`} />
            {selectedSubmission && (
                <Dialog
                    open={selectedSubmission !== null}
                    onClose={() => setSelectedSubmission(null)}
                    fullWidth
                    maxWidth="lg"
                    className="overflow-hidden"
                >
                    <SubmissionDetails submission={selectedSubmission} />
                    <DialogActions>
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={() => setSelectedSubmission(null)}
                            startIcon={<CloseIcon />}
                        >
                            {t('close')}
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
            <div className="flex justify-around m-4 flex-row">
                <Link
                    to={`/round/${round.roundId}/submission/evaluated?prev=${prevToken}`}
                    style={{ visibility: prevToken ? 'visible' : 'hidden' }}
                >
                    <Button variant="contained" color="primary" startIcon={<ArrowBackIcon />}>
                        {t('previous')}
                    </Button>
                </Link>
                <Link
                    to={`/round/${round.roundId}/submission/evaluated?next=${nextToken}`}
                    style={{ visibility: nextToken ? 'visible' : 'hidden' }}
                >
                    <Button variant="contained" color="primary" endIcon={<ArrowForwardIcon />}>
                        {t('next')}
                    </Button>
                </Link>
            </div>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>{t('evaluation.modifyTable.name')}</TableCell>
                        <TableCell>{t('evaluation.modifyTable.preview')}</TableCell>
                        <TableCell>{t('evaluation.modifyTable.score')}</TableCell>
                        <TableCell>{t('evaluation.modifyTable.action')}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {evaluations.map(
                        (evaluation) =>
                            evaluation.submission && (
                                <TableRow key={evaluation.evaluationId}>
                                    <TableCell>
                                        {evaluation.submission.title.replaceAll('_', ' ')}
                                    </TableCell>
                                    <TableCell>
                                        <img
                                            src={evaluation.submission.thumburl || ''}
                                            alt={evaluation.submission.title}
                                            width={100}
                                            height={100}
                                            style={{ maxWidth: 100, height: 'auto' }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Score evType={evaluation.type} score={evaluation.score} />
                                    </TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => setSelectedSubmission(evaluation.submission)}>
                                            <InformationIcon />
                                        </IconButton>
                                        <IconButton
                                            component={Link}
                                            to={`/round/${evaluation.roundId}/submission/evaluated/${evaluation.evaluationId}?back=${location.pathname}${location.search}`}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            )
                    )}
                </TableBody>
            </Table>
        </>
    )
}

export default RoundEvaluatedPage
