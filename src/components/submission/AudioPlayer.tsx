import React, { createRef, useEffect } from 'react'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import SkipNextIcon from '@mui/icons-material/SkipNext'
import PauseIcon from '@mui/icons-material/Pause'

type AudioPlayerProps = {
    src: string
    title: string
    author: string
    onPosterLoaded?: () => void
}

function AudioPlayer({ src, title, author, onPosterLoaded }: AudioPlayerProps) {
    const theme = useTheme()
    const audioRef = createRef<HTMLAudioElement>()
    const [mAudio, setAudio] = React.useState<HTMLAudioElement | null>(null)
    const [playing, setPlaying] = React.useState(false)

    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return
        setAudio(audio)
        const onLoadCallback = () => {
            if (onPosterLoaded) onPosterLoaded()
        }
        audio.onloadeddata = onLoadCallback
        audio.onpause = () => setPlaying(false)
        return () => {
            audio.onloadeddata = null
        }
    }, [audioRef, onPosterLoaded])

    useEffect(() => {
        if (mAudio) setPlaying(false)
    }, [mAudio, src])

    return (
        <Card sx={{ display: 'flex' }}>
            <audio
                ref={audioRef}
                src={src}
                crossOrigin="anonymous"
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                    <Typography component="div" variant="h5">
                        {title}
                    </Typography>
                    <Typography variant="subtitle1" component="div" sx={{ color: 'text.secondary' }}>
                        {author}
                    </Typography>
                </CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                    <IconButton aria-label="previous">
                        {theme.direction === 'rtl' ? <SkipNextIcon /> : <SkipPreviousIcon />}
                    </IconButton>
                    <IconButton
                        aria-label="play/pause"
                        onClick={() => {
                            if (mAudio) {
                                if (mAudio.paused) {
                                    mAudio.play()
                                } else {
                                    mAudio.pause()
                                }
                            }
                        }}
                    >
                        {!playing ? (
                            <PlayArrowIcon sx={{ height: 38, width: 38 }} />
                        ) : (
                            <PauseIcon sx={{ height: 38, width: 38 }} />
                        )}
                    </IconButton>
                    <IconButton aria-label="next">
                        {theme.direction === 'rtl' ? <SkipPreviousIcon /> : <SkipNextIcon />}
                    </IconButton>
                </Box>
            </Box>
        </Card>
    )
}

export default AudioPlayer
