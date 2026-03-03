import type { Submission } from '@/types/submission'
import { lazy, Suspense } from 'react'
import SubmissionDetails from './SubmissionDetails'

const VideoPlayer = lazy(() => import('./VideoPlayer'))

const VideoPreview = ({ submission }: { submission: Submission }) => {
    return (
        <>
            <Suspense fallback={<div>Loading...</div>}>
                <VideoPlayer
                    poster={submission.thumburl}
                    src={submission.url}
                    height={submission.height}
                    width={submission.width}
                />
            </Suspense>
            <SubmissionDetails submission={submission} />
        </>
    )
}

export default VideoPreview
