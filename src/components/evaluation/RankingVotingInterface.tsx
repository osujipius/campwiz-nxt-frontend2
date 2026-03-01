import React, { useState } from 'react'
import SortableList, { SortableItem } from 'react-easy-sort'
import { Badge, Button, Dialog, DialogActions, DialogContent, Fab } from '@mui/material'
import { arrayMoveImmutable } from 'array-move'
import './ranking.css'
import ViewIcon from '@mui/icons-material/Visibility'
import type { Evaluation, Submission } from '@/types/submission'
import { loadNextEvaluation, submitVote } from '@/api/evaluation'
import AllSet from './AllSet'
import Header from '@/components/home/Header'
import CloseButton from '@mui/icons-material/Close'
import SaveIcon from '@mui/icons-material/Save'

const handleStartDrag = () => {
    document.body.style.overflow = 'hidden'
}
const handleStopDrag = () => {
    document.body.style.overflow = 'auto'
}

const RankingVotingInterface = ({
    initailEvaluations,
    limit,
    roundId,
    isPublicJury,
    campaignId,
    next: initialNext,
}: {
    roundId: string
    initailEvaluations: Evaluation[]
    next?: string
    limit: number
    campaignId: string
    isPublicJury: boolean
}) => {
    const [evaluations, setEvaluations] = useState<Evaluation[]>(initailEvaluations)
    const [next, setNext] = useState<string | undefined>(initialNext)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [currentSelectedForPreview, setCurrentSelectedForPreview] = useState<Submission | null>(null)

    const onSortEnd = (oldIndex: number, newIndex: number) => {
        setEvaluations((array) => arrayMoveImmutable(array, oldIndex, newIndex))
    }

    const saveRanking = async () => {
        setIsLoading(true)
        try {
            const perPositionPoint = 100 / limit
            const newEvaluations = evaluations.map((evaluation, index) => ({
                evaluationId: evaluation.evaluationId,
                score: perPositionPoint * (evaluations.length - index),
                comment: null,
                submissionId: evaluation.submissionId,
            }))

            const resp = await submitVote(roundId, isPublicJury, newEvaluations)
            if (!resp) return
            if ('detail' in resp) {
                console.error(resp.detail)
            } else {
                const response = await loadNextEvaluation({
                    roundId,
                    limit,
                    next,
                    includeSubmissions: true,
                    isPublic: isPublicJury,
                })
                if (!response) return
                if ('detail' in response) {
                    setError(response.detail)
                    return
                }
                const addedEvaluations = response.data
                if (response.next === undefined || response.next === next || response.next === '') {
                    setNext(undefined)
                    setEvaluations([])
                } else {
                    setEvaluations(addedEvaluations)
                    setNext(response.next)
                }
            }
        } finally {
            setIsLoading(false)
        }
    }

    if (error) return <p>Error : {error}</p>
    if (evaluations.length === 0)
        return <AllSet campaignId={campaignId} roundId={roundId} skipCount={0} />

    return (
        <>
            <Header />
            <div>
                <SortableList
                    allowDrag={!isLoading}
                    onSortEnd={onSortEnd}
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        userSelect: 'none',
                    }}
                    draggedItemClassName="k"
                >
                    {evaluations.map(({ submission }, position) =>
                        submission ? (
                            <SortableItem key={submission.submissionId}>
                                <Badge
                                    overlap="circular"
                                    anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                                    badgeContent={position + 1}
                                    color="primary"
                                >
                                    <div
                                        style={{
                                            position: 'relative',
                                            margin: '2em',
                                            cursor: 'grab',
                                            userSelect: 'none',
                                            borderRadius: '20%',
                                        }}
                                        className="w-20 h-20 sm:w-24 sm:h-24"
                                        onDragStart={handleStartDrag}
                                        onDragEnd={handleStopDrag}
                                    >
                                        <Fab
                                            color="primary"
                                            size="small"
                                            sx={{ position: 'absolute', bottom: 0, right: 0 }}
                                            aria-label="show-preview"
                                            onClick={() => setCurrentSelectedForPreview(submission)}
                                        >
                                            <ViewIcon />
                                        </Fab>
                                        <img
                                            src={submission.thumburl}
                                            alt={submission.title}
                                            style={{
                                                pointerEvents: 'none',
                                                borderRadius: '20%',
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    </div>
                                </Badge>
                            </SortableItem>
                        ) : null
                    )}
                </SortableList>
                <div style={{ textAlign: 'center', marginTop: 20 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={saveRanking}
                        disabled={isLoading}
                        startIcon={<SaveIcon />}
                        sx={{ mr: 0, ml: 'auto', right: 0 }}
                    >
                        Submit
                    </Button>
                </div>
                {currentSelectedForPreview && (
                    <Dialog
                        open={Boolean(currentSelectedForPreview)}
                        onClose={() => setCurrentSelectedForPreview(null)}
                        sx={{ textAlign: 'center' }}
                    >
                        <DialogContent>
                            <img
                                src={currentSelectedForPreview.thumburl}
                                alt={currentSelectedForPreview.title}
                                width={currentSelectedForPreview.thumbwidth || 640}
                                height={currentSelectedForPreview.thumbheight}
                                style={{ maxWidth: '100%', height: 'auto' }}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button
                                onClick={() => setCurrentSelectedForPreview(null)}
                                color="error"
                                variant="contained"
                                startIcon={<CloseButton />}
                            >
                                Close
                            </Button>
                        </DialogActions>
                    </Dialog>
                )}
            </div>
        </>
    )
}

export default RankingVotingInterface
