import type { Task } from "@/types/task"
import LottieWrapper from "@/components/LottieWrapper"
import { useEffect, useState } from "react"

type StatusThingyProps = {
    taskId: string
    onSuccess: (task: Task) => void
}

const DistributionStatusThingy = ({ taskId, onSuccess }: StatusThingyProps) => {
    const [status, setStatus] = useState('pending')

    useEffect(() => {
        if (!taskId) return
        const API_PATH = import.meta.env.VITE_BACKEND_API_PATH || '/api/v2';
        const baseURL = import.meta.env.VITE_BACKEND_API_URL || '';
        const eventSource = new EventSource(`${baseURL}${API_PATH}/task/${taskId}`);

        eventSource.addEventListener('task', (event) => {
            const data = JSON.parse(event.data)
            setStatus(data.status)
            if (data.status === 'error') eventSource.close()
            if (data.status === 'success') {
                eventSource.close()
                onSuccess(data)
            }
        })

        eventSource.onerror = () => {
            setStatus('error')
            eventSource.close()
        }

        return () => { eventSource.close() }
    }, [onSuccess, taskId])

    return (<>
        {status === 'pending' && <LottieWrapper src="/lottie/loading.lottie" />}
        {status === 'success' && <LottieWrapper src="/lottie/success.lottie" />}
        {status === 'error' && <LottieWrapper src="/lottie/error.lottie" />}
    </>)
}

export default DistributionStatusThingy
