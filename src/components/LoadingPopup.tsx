import LottieWrapper from "./LottieWrapper";

const LoadingPopup = ({ src = '/lottie/loading.lottie' }: { src?: string }) => (
    <div className="loading-popup fixed top-0 left-0 w-full h-full bg-transparent z-50 flex items-center justify-center flex-col backdrop-blur-[2px]">
        <LottieWrapper src={src} />
    </div>
)

export default LoadingPopup
