import type { Evaluation, Submission } from '@/types/submission'
import LinearProgress from '@mui/material/LinearProgress'
import SubmissionDetails from '@/components/submission/SubmissionDetails'
import { lazy, Suspense, useState } from 'react'
import { EvaluationType, MediaType } from '@/types/round'
import { Button, Dialog, DialogActions, useMediaQuery } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import InfoIcon from '@mui/icons-material/Info'
import Header from '@/components/home/Header'

const VideoPlayer = lazy(() => import('@/components/submission/VideoPlayer'))
const AudioPlayer = lazy(() => import('@/components/submission/AudioPlayer'))
const BinaryVotingInterface = lazy(() => import('./BinaryVotingInterface'))
const RatingVotingInterface = lazy(() => import('./RatingVotingInterface'))

const InfoTriggerButton = ({ submission }: { submission: Submission }) => {
    const [showInfo, setShowInfo] = useState(false)
    const handleClick = () => setShowInfo(!showInfo)

    return (
        <Suspense fallback={<LinearProgress />}>
            <Button
                onClick={handleClick}
                disabled={showInfo}
                variant="text"
                color="primary"
                size="small"
                startIcon={<InfoIcon />}
                sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
                File Information
            </Button>
            <Dialog open={showInfo} onClose={handleClick} fullWidth maxWidth="lg" className="overflow-hidden">
                <SubmissionDetails submission={submission} />
                <DialogActions>
                    <Button variant="outlined" color="error" onClick={handleClick} startIcon={<CloseIcon />}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Suspense>
    )
}

type ScoreOrBinaryVotingInterfaceProps = {
    campaignId: string
    submission: Submission
    currentEvaluation: Evaluation
    nextImageWrapper: (direction: number) => void
    evaluationCount: number
    assignmentCount: number
    isPublicJury: boolean
    isLoading: boolean
    currentCursor: number
    setCurrentCursor: (cursor: number) => void
    submit: (score: number) => Promise<void>
    saving: boolean
    error: string | null
    returnTo: string
    hasNext: boolean
    showProgress?: boolean
    noHeader?: boolean
    setImageLoaded: (loaded: boolean) => void
    imageLoaded: boolean
    onSkip: () => void
}

const ScoreOrBinaryVotingInterface = ({
    submission,
    currentEvaluation,
    nextImageWrapper,
    evaluationCount,
    assignmentCount,
    isLoading,
    currentCursor,
    error,
    submit,
    saving,
    returnTo,
    hasNext = true,
    showProgress = true,
    noHeader = false,
    setImageLoaded,
    imageLoaded,
    onSkip,
}: ScoreOrBinaryVotingInterfaceProps) => {
    const isSmall = useMediaQuery((theme: { breakpoints: { down: (key: string) => string } }) =>
        theme.breakpoints.down('sm')
    )

    return (
        <>
            {!noHeader && <Header returnTo={returnTo} />}
            <div
                className="flex sm:h-full w-full sm:flex-row flex-col"
                style={{ height: 'calc(95% - 75px)' }}
            >
                <div className="relative w-full sm:w-2/3 h-3/4 flex flex-col">
                    {isSmall && (
                        <div className="relative max-h-1/12 flex flex-col items-center">
                            <h1 className="font-bold text-center text-ellipsis">
                                {submission.title.substring(0, 40)}
                                {submission.title.length > 40 ? '...' : ''}
                            </h1>
                            <InfoTriggerButton submission={submission} />
                        </div>
                    )}
                    {submission.mediatype === MediaType.IMAGE && (
                        <img
                            src={submission.thumburl || '/red-hill.svg'}
                            alt={submission.title}
                            className="m-auto block object-contain max-h-5/6 self-center sm:self-auto"
                            loading="lazy"
                            onLoad={() => setImageLoaded(true)}
                            width={submission.thumbwidth || 640}
                            height={submission.thumbheight}
                            onError={() => setImageLoaded(true)}
                        />
                    )}
                    {submission.mediatype === MediaType.VIDEO && (
                        <Suspense fallback={<LinearProgress sx={{ width: '100%' }} />}>
                            <VideoPlayer
                                poster={submission.thumburl}
                                src={submission.url}
                                height={submission.height}
                                width={submission.width}
                                onPosterLoaded={() => setImageLoaded(true)}
                            />
                        </Suspense>
                    )}
                    {submission.mediatype === MediaType.AUDIO && (
                        <Suspense fallback={<LinearProgress sx={{ width: '100%' }} />}>
                            <AudioPlayer
                                src={submission.url}
                                title={submission.title}
                                author={submission.author}
                                onPosterLoaded={() => setImageLoaded(true)}
                            />
                        </Suspense>
                    )}
                </div>
                <div className="relative h-1/6 sm:h-11/12 w-full sm:w-1/3 flex flex-col justify-center items-center my-auto">
                    <Suspense fallback={<LinearProgress sx={{ width: '100%' }} />}>
                        {!isSmall && <SubmissionDetails submission={submission} />}
                        {error && <p className="text-center text-lg text-red-600 font-bold">{error}</p>}
                        {currentEvaluation.type === EvaluationType.BINARY && (
                            <BinaryVotingInterface
                                goNext={() => nextImageWrapper(1)}
                                goPrevious={() => nextImageWrapper(-1)}
                                submitScore={submit}
                                evaluation={currentEvaluation}
                                saving={saving || isLoading || !imageLoaded}
                                noPrevious={currentCursor === 0}
                                noNext={!hasNext}
                                evaluationCount={evaluationCount}
                                assignmnetCount={assignmentCount}
                                showProgress={showProgress}
                                onSkip={onSkip}
                            />
                        )}
                        {currentEvaluation.type === EvaluationType.SCORE && (
                            <RatingVotingInterface
                                evaluation={currentEvaluation}
                                goNext={() => nextImageWrapper(1)}
                                goPrevious={() => nextImageWrapper(-1)}
                                submitScore={submit}
                                saving={saving || isLoading || !imageLoaded}
                                noPrevious={currentCursor === 0}
                                assignmnetCount={assignmentCount}
                                evaluationCount={evaluationCount}
                                noNext={!hasNext}
                                showProgress={showProgress}
                                onSkip={onSkip}
                            />
                        )}
                    </Suspense>
                </div>
            </div>
        </>
    )
}

export default ScoreOrBinaryVotingInterface
