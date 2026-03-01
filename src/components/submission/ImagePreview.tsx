import type { Submission } from '@/types/submission'
import React from 'react'
import SubmissionDetails from './SubmissionDetails'

const ImagePreview = ({
    submission,
    votingComponent,
}: {
    submission: Submission
    votingComponent: React.ReactNode
}) => {
    return (
        <div>
            <img
                src={submission.url}
                alt={submission.title}
                width={Math.min(submission.thumbwidth, 400)}
                height={Math.min(submission.thumbheight, 400)}
                style={{ maxWidth: '100%', height: 'auto' }}
            />
            {votingComponent}
            <SubmissionDetails submission={submission} />
        </div>
    )
}

export default ImagePreview
