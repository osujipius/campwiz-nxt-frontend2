import type { Submission } from '@/types/submission'
import { Paper } from '@mui/material'
import { lazy, Suspense } from 'react'
import SubmissionDetails from './SubmissionDetails'

const AudioPlayer = lazy(() => import('./AudioPlayer'))

const AudioPreview = ({ submission }: { submission: Submission }) => {
    return (
        <Paper>
            <Suspense fallback={<div>Loading...</div>}>
                <AudioPlayer src={submission.url} title={submission.title} author={submission.author} />
            </Suspense>
            <SubmissionDetails submission={submission} />
        </Paper>
    )
}

export default AudioPreview
