import type { Task } from "@/types/task"
import LottieWrapper from "@/components/LottieWrapper"
import { Chip } from "@mui/material"
import { useEffect, useState } from "react"
import { fetchFromBackend } from "@/api"

type StatusThingyProps = {
    taskId: string
    onSuccess: (task: Task) => void
    showCounts?: boolean
}

const ImportStatusThingy = ({ taskId, onSuccess, showCounts = true }: StatusThingyProps) => {
    const [status, setStatus] = useState('pending')
    const [successCount, setSuccessCount] = useState(0)
    const [failedCount, setFailedCount] = useState(0)

    useEffect(() => {
        if (!taskId) return
        const API_PATH = import.meta.env.VITE_BACKEND_API_PATH || '/api/v2';
        const baseURL = import.meta.env.VITE_BACKEND_API_URL || '';
        const eventSource = new EventSource(`${baseURL}${API_PATH}/task/${taskId}/stream`);

        eventSource.addEventListener('task', (event) => {
            const data: Task = JSON.parse(event.data)
            setStatus(data.status)
            setSuccessCount(data.successCount)
            setFailedCount(data.failedCount)
            if (data.status === 'error') {
                eventSource.close()
            }
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

    // Use fetchFromBackend to get the correct base URL for SSE
    void fetchFromBackend;

    return (<>
        {status === 'pending' && <LottieWrapper src="/lottie/importing.lottie" />}
        {status === 'success' && <LottieWrapper src="/lottie/success.lottie" />}
        {status === 'error' && <LottieWrapper src="/lottie/error.lottie" />}
        {showCounts && (
            <div className="flex flex-row items-center justify-around">
                <Chip label={`Success: ${successCount}`} color="success" />
                <Chip label={`Failed: ${failedCount}`} color="error" />
            </div>
        )}
    </>)
}

export default ImportStatusThingy
