import { Suspense, useState } from "react"
import { startImportFromCommons } from "@/api/round"
import ImportStatusThingy from "./ImportStatusThingy"
import LottieWrapper from "@/components/LottieWrapper"
import CategoryInput from "@/components/round/CategoryInput"
import type { Task } from "@/types/task"

type ImportWidgetProps = {
    roundId: string
    importing: boolean
    setImporting: (loading: boolean) => void
    afterImport: (t: Task) => void
}

const ImportFromCommonsWidget = ({ roundId, importing, setImporting, afterImport }: ImportWidgetProps) => {
    const [taskID, setTaskID] = useState('')

    const startImporting = async (categories: string[]) => {
        try {
            setImporting(true)
            const taskResponse = await startImportFromCommons(roundId, categories)
            if ('detail' in taskResponse) throw new Error(taskResponse.detail)
            setTaskID(taskResponse.data.taskId)
        } catch (e) {
            console.error(e)
        } finally {
            setImporting(false)
        }
    }

    return taskID
        ? <ImportStatusThingy taskId={taskID} onSuccess={afterImport} />
        : (
            <Suspense fallback={<LottieWrapper src="/lottie/importing.lottie" />}>
                <CategoryInput onSave={startImporting} alreadyIncludedCategories={[]} saving={importing} />
            </Suspense>
        )
}

export default ImportFromCommonsWidget
