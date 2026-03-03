import React, { useEffect } from 'react'
import IconButton from '@mui/material/IconButton'
import SkipNextIcon from '@mui/icons-material/SkipNext'
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious'
import Rating from '@mui/material/Rating'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import type { VotingInterfaceProps } from './VotingInterface'
import { Typography } from '@mui/material'
import Button from '@mui/material/Button'
import TickIcon from '@mui/icons-material/Check'
import { Link } from 'react-router-dom'

const RatingVotingInterface = ({
    goNext,
    goPrevious,
    saving,
    evaluation,
    assignmnetCount,
    evaluationCount,
    noNext,
    noPrevious,
    submitScore,
    showProgress = true,
    onSkip,
}: VotingInterfaceProps) => {
    const [currentScore, setCurrentScore] = React.useState<number>(evaluation.score / 20 || 0)
    useEffect(() => {
        setCurrentScore(evaluation.score / 20)
    }, [evaluation])

    return (
        <>
            <div className="flex flex-col justify-center">
                <Rating
                    name="size-large"
                    value={currentScore}
                    sx={{
                        '& .MuiRating-iconFilled': {
                            color: '#ff6d75',
                            fontSize: { xs: '1.5em', sm: '2em' },
                            mx: 1,
                        },
                        '& .MuiRating-iconHover': {
                            color: '#ff3d47',
                            fontSize: { xs: '1.5em', sm: '2em' },
                            mx: 1,
                        },
                        '& .MuiRating-iconEmpty': {
                            fontSize: { xs: '1.5em', sm: '2em' },
                            mx: 1,
                        },
                        my: 1,
                    }}
                    disabled={saving}
                    max={5}
                    icon={<FavoriteIcon fontSize="inherit" />}
                    emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
                    onChange={(_event, newValue) => {
                        setCurrentScore(newValue || 0)
                    }}
                />
                <div className="flex justify-around items-start">
                    <IconButton
                        color="primary"
                        size="large"
                        onClick={goPrevious}
                        disabled={saving || noPrevious}
                        title="Previous"
                    >
                        <SkipPreviousIcon fontSize="large" />
                    </IconButton>
                    <Button
                        color="primary"
                        size="large"
                        onClick={() => {
                            if (onSkip) onSkip()
                            goNext()
                        }}
                        disabled={saving || noNext}
                        title="Skip"
                        endIcon={<SkipNextIcon fontSize="large" />}
                        variant="outlined"
                        sx={{ borderRadius: 2, px: 2, my: 'auto' }}
                    >
                        Skip
                    </Button>
                    <IconButton
                        color="success"
                        size="large"
                        onClick={() => submitScore(currentScore * 20)}
                        disabled={saving}
                        title="Save"
                    >
                        <TickIcon fontSize="large" />
                    </IconButton>
                </div>
            </div>
            {showProgress && (
                <Typography
                    variant="subtitle1"
                    sx={{
                        fontFamily: 'Lora, serif',
                        textAlign: 'right',
                        m: 1,
                        display: 'block',
                        width: '100%',
                        px: 2,
                    }}
                >
                    {evaluationCount} out of {assignmnetCount} completed
                    <br />
                    <Link
                        to={`/round/${evaluation.roundId}/submission/evaluated`}
                        className="text-blue-500 hover:underline"
                    >
                        Modify Votes
                    </Link>
                </Typography>
            )}
        </>
    )
}

export default RatingVotingInterface
