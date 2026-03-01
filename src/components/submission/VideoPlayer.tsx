import { useMemo } from 'react'

type VideoPlayerProps = {
    src: string
    poster: string
    height: number
    width: number
    onPosterLoaded?: () => void
}

const VideoPlayer = ({ src, poster, height, width, onPosterLoaded }: VideoPlayerProps) => {
    const calculatedWidth = useMemo(() => {
        if (width / height > 9 / 16) {
            return '100%'
        }
        let windowheight = 500,
            windowwidth = 641
        if (typeof window !== 'undefined') {
            windowheight = (window.innerHeight * 5) / 6 * 0.9
            windowwidth = window.innerWidth * 0.6
        }
        let calculatedHeight = windowheight,
            computedWidth = windowwidth
        calculatedHeight = (windowwidth * height) / width
        if (calculatedHeight > windowheight) {
            calculatedHeight = windowheight
            computedWidth = (windowheight * width) / height
        }
        void calculatedHeight
        return `${computedWidth}px`
    }, [height, width])

    return (
        <div
            style={{
                maxHeight: '90%',
                maxWidth: '100%',
                margin: 'auto',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <video
                controls
                src={src}
                poster={poster}
                playsInline
                crossOrigin="anonymous"
                onLoadedData={onPosterLoaded}
                style={{
                    maxHeight: '100%',
                    maxWidth: calculatedWidth,
                    position: 'relative',
                }}
            />
        </div>
    )
}

export default VideoPlayer
