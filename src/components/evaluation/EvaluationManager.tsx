import { loadNextEvaluation, submitVote } from '@/api/evaluation'
import type { Evaluation, EvaluationListResponseWithCurrentStats } from '@/types/submission'
import React, { useEffect, useState } from 'react'
import { MediaType } from '@/types/round'
import AllSet from './AllSet'
import ScoreOrBinaryVotingInterface from './BinaryOrScoreVotingInterface'

const prefetchSubmissionPreview = async (url: string) => {
    try {
        const response = await fetch(url)
        if (!response.ok) throw new Error(response.statusText)
        const blob = await response.blob()
        const localURL = URL.createObjectURL(blob)
        return { url: localURL }
    } catch (error) {
        return { error: (error as Error).message }
    }
}

const EvaluationManager = ({
    roundId,
    initailEvaluations: initialEvaluations,
    next: initialNext,
    limit = 1,
    campaignId,
    isPublicJury,
    assignmentCount: initialAssignmentCount,
    evaluationCount: initialEvaluationCount,
}: {
    roundId: string
    initailEvaluations: Evaluation[]
    next?: string
    limit: number
    campaignId: string
    isPublicJury: boolean
    evaluationCount: number
    assignmentCount: number
}) => {
    const [evaluations, setEvaluations] = React.useState<Evaluation[]>(initialEvaluations)
    const [next, setNext] = React.useState<string | undefined>(initialNext)
    const [currentCursor, setCurrentCursor] = React.useState(0)
    const [isLoading, setIsLoading] = React.useState(false)
    const [currentEvaluation, setCurrentEvaluation] = useState<Evaluation | null>(evaluations?.[0] ?? null)
    const [imageLoaded, setImageLoaded] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [hasNextEvaluation, setHasNextEvaluation] = useState<boolean>(evaluations?.length > currentCursor)
    const nextEvaluation = hasNextEvaluation ? evaluations[currentCursor + 1] : null
    const [assignmentCount, setAssignmentCount] = useState(initialAssignmentCount)
    const [evaluationCount, setEvaluationCount] = useState(initialEvaluationCount)
    const [saving, setSaving] = useState(false)
    const [descriptionFetching, setDescriptionFetching] = useState(false)
    const [fetchedDescription, setFetchedDescription] = useState<string | null>(null)
    const [skipCount, setSkipCount] = useState(0)

    useEffect(() => {
        if (!evaluations) return setCurrentEvaluation(null)
        if (descriptionFetching) return

        const cur = evaluations[currentCursor]
        if (cur && cur.submission && (!cur.submission.description || cur.submission.description === '') && !descriptionFetching) {
            const qs = new URLSearchParams({
                action: 'query',
                format: 'json',
                prop: 'imageinfo',
                titles: `File:${cur.submission.title}`,
                formatversion: '2',
                iiprop: 'extmetadata|url',
                iiurlwidth: '640',
                iiurlheight: '640',
                iimetadataversion: 'latest',
                iiextmetadatafilter: 'ImageDescription',
                origin: '*',
            }).toString()
            const url = 'https://commons.wikimedia.org/w/api.php?' + qs
            setDescriptionFetching(true)
            fetch(url)
                .then((response) => response.json())
                .then((data) => {
                    if (data.query && data.query.pages && data.query.pages.length > 0) {
                        const page = data.query.pages[0]
                        if (page.imageinfo && page.imageinfo.length > 0) {
                            const imageInfo = page.imageinfo[0]
                            if (imageInfo.extmetadata && imageInfo.extmetadata.ImageDescription) {
                                const tempElement = document.createElement('div')
                                tempElement.innerHTML = imageInfo.extmetadata.ImageDescription.value
                                const description = tempElement.innerText
                                tempElement.remove()
                                setFetchedDescription(description)
                                setCurrentEvaluation((prev) => {
                                    if (!prev || !prev.submission) return null
                                    return {
                                        ...prev,
                                        submission: { ...prev.submission, description },
                                    }
                                })
                            }
                        }
                    }
                })
                .catch((error) => {
                    console.error('Error fetching description:', error)
                })
                .finally(() => {
                    setDescriptionFetching(false)
                })
        }
        setCurrentEvaluation(cur)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [evaluations, currentCursor])

    useEffect(() => {
        if (nextEvaluation) {
            if (nextEvaluation.submission && nextEvaluation.submission.thumburl) {
                if (nextEvaluation.submission.mediatype === MediaType.IMAGE) {
                    if (nextEvaluation.submission.thumburl.startsWith('http')) {
                        prefetchSubmissionPreview(nextEvaluation.submission.thumburl).then((response) => {
                            if (response.error || !response.url) return
                            setEvaluations((evaluations) =>
                                evaluations.map((evaluation, index) => {
                                    if (!evaluation.submission) return evaluation
                                    if (index === currentCursor + 1)
                                        return {
                                            ...evaluation,
                                            submission: {
                                                ...evaluation.submission,
                                                thumburl: response.url!,
                                                submissionId: evaluation.submission.submissionId || '',
                                            },
                                        }
                                    return evaluation
                                })
                            )
                        })
                    }
                }
            }
        }
    }, [currentCursor, nextEvaluation])

    const nextImageWrapper = (dx: number = 1) => {
        setImageLoaded(false)
        setCurrentCursor((cursor) => cursor + dx)
    }

    const submit = async (score: number) => {
        try {
            if (saving) return
            if (!currentEvaluation) return
            if (!currentEvaluation.submission) return
            if (!imageLoaded) return
            setSaving(true)
            const response = await submitVote(roundId, isPublicJury, [
                {
                    evaluationId: currentEvaluation.evaluationId,
                    score,
                    comment: null,
                    submissionId: currentEvaluation.submission.submissionId,
                    description: fetchedDescription,
                },
            ])
            if (!response) throw new Error('Something went wrong')
            if ('detail' in response) throw new Error(response.detail)
            const r = response as EvaluationListResponseWithCurrentStats
            setAssignmentCount(r.totalAssignmentCount)
            setEvaluationCount(r.totalEvaluatedCount)
            nextImageWrapper()
            setError(null)
        } catch (error) {
            setError((error as Error).message)
        } finally {
            setSaving(false)
        }
    }

    useEffect(() => {
        if (!next || !roundId || !limit || !hasNextEvaluation || !evaluations || !evaluations.length) return
        if (currentCursor < evaluations.length - 1) return
        setIsLoading(true)
        loadNextEvaluation({
            roundId,
            limit,
            next,
            includeSubmissions: true,
            isPublic: isPublicJury,
            includeEvaluated: false,
            includeNonEvaluated: true,
            randomize: true,
        }).then(async (response) => {
            if (!response) return
            if ('detail' in response) {
                setError(response.detail)
                return
            }
            const r = response as EvaluationListResponseWithCurrentStats
            const addedEvaluations = r.data
            setAssignmentCount(r.totalAssignmentCount)
            setEvaluationCount(r.totalEvaluatedCount)
            setEvaluations((evaluations) => [...evaluations, ...addedEvaluations])
            setNext(r.next)
            setHasNextEvaluation(r.next !== undefined && r.next !== next && r.next !== '')
            setIsLoading(false)
        })
    }, [currentCursor, evaluations, evaluations.length, hasNextEvaluation, isPublicJury, limit, next, roundId])

    if (!currentEvaluation)
        return <AllSet roundId={roundId} campaignId={campaignId} skipCount={skipCount} />

    const { submission } = currentEvaluation
    if (!submission) return null

    return (
        <ScoreOrBinaryVotingInterface
            campaignId={campaignId}
            submission={submission}
            currentEvaluation={currentEvaluation}
            nextImageWrapper={nextImageWrapper}
            imageLoaded={imageLoaded}
            setImageLoaded={setImageLoaded}
            evaluationCount={evaluationCount}
            assignmentCount={assignmentCount}
            isPublicJury={isPublicJury}
            isLoading={isLoading}
            currentCursor={currentCursor}
            setCurrentCursor={setCurrentCursor}
            submit={submit}
            saving={saving}
            error={error}
            returnTo={`/campaign/${campaignId}`}
            hasNext={true}
            onSkip={() => {
                setSkipCount((prev) => prev + 1)
            }}
        />
    )
}

export default EvaluationManager
