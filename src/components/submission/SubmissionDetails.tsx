import { MediaType } from '@/types/round'
import type { Submission } from '@/types/submission'
import { Table, TableBody, TableCell, TableRow, Typography } from '@mui/material'
import React from 'react'

type DetailsProps = {
    submission: Submission
}

const KeyValue = ({ name, value }: { name: string; value: React.ReactNode }) => (
    <TableRow>
        <TableCell>{name}</TableCell>
        <TableCell>{value}</TableCell>
    </TableRow>
)

const Duration = ({ duration }: { duration: number }) => {
    if (duration < 0) return <>Unknown</>
    if (duration < 1000) return <>{duration}ms</>
    if (duration < 60000) return <>{Math.floor(duration / 1000)}s</>
    if (duration < 3600000) return <>{Math.floor(duration / 60000)}:{Math.round(duration / 1000)}s</>
    return <>{Math.floor(duration / 3600000)}:{Math.round(duration / 60000)}:{duration / 1000}s</>
}

const AudioDetails = ({ submission }: DetailsProps) => {
    if (![MediaType.AUDIO, MediaType.VIDEO].includes(submission.mediatype as MediaType)) {
        return null
    }
    return (
        <>
            <KeyValue name="Duration" value={<Duration duration={submission.duration} />} />
            <KeyValue name="Bitrate" value={submission.bitrate} />
        </>
    )
}

const VisualDetails = ({ submission }: DetailsProps) => {
    const sizeInMB = (submission.size / 1024 / 1024).toFixed(2)
    const sizeInKB = (submission.size / 1024).toFixed(2)
    const size = submission.size > 1024 * 1024 ? `${sizeInMB} MB` : `${sizeInKB} KB`
    return <KeyValue name="Dimensions" value={`${submission.width} × ${submission.height} (${size})`} />
}

const MediaDetails = ({ submission }: DetailsProps) => (
    <>
        <VisualDetails submission={submission} />
        <AudioDetails submission={submission} />
    </>
)

const dateFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
})

const SubmissionDetails = ({ submission }: DetailsProps) => {
    const truncatedDescription =
        submission.description?.length > 300
            ? submission.description?.slice(0, 300) + '...'
            : submission.description
    const truncatedTitle =
        submission.title?.length > 50 ? submission.title?.slice(0, 50) + '...' : submission.title

    return (
        <div className="p-2">
            <a
                href={`https://commons.wikimedia.org/wiki/File:${submission.title}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        textAlign: 'center',
                        textOverflow: 'clip',
                        textWrap: 'pretty',
                        wordWrap: 'break-word',
                        whiteSpace: 'normal',
                        overflowWrap: 'break-word',
                        maxWidth: '100%',
                    }}
                    color="primary"
                >
                    {truncatedTitle.replaceAll('_', ' ')}
                </Typography>
            </a>
            <Table>
                <TableBody>
                    <KeyValue name="Author" value={submission.author} />
                    <KeyValue name="Description" value={truncatedDescription} />
                    <KeyValue
                        name="Upload Date"
                        value={dateFormatter.format(new Date(submission.createdAtServer))}
                    />
                    <MediaDetails submission={submission} />
                </TableBody>
            </Table>
        </div>
    )
}

export default SubmissionDetails
