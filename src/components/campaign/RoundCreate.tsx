import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material"
import { createRound } from "@/api/round"
import { startDistributionTask } from "@/api/round"
import React, { lazy, useCallback, useMemo, useReducer, useState } from "react"
import { roundCreateReducer, initialRoundCreate } from "@/types/round/create"
import type { Round } from "@/types/round"
import type { Task } from "@/types/task"
import LoadingPopup from "@/components/LoadingPopup"
import Slide from '@mui/material/Slide'
import type { TransitionProps } from '@mui/material/transitions'
import DistributionStatusThingy from "./DistributionStatusThingy"
import ImportFromCommonsDialog from "./ImportFromCommonsDialog"
import ImportFromRoundDialog from "./ImportFromRoundDialog"

const RoundEditForm = lazy(() => import("@/components/round/RoundEditForm"))

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement<unknown> },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
})

const Stage = {
    CREATE: 'create',
    IMPORT: 'import',
    DISTRIBUTE: 'distribute',
    SUCCESS: 'success',
} as const;
type Stage = typeof Stage[keyof typeof Stage];

const CreateRound = ({ campaignId, onClose }: { campaignId: string; onAfterCreationSuccess: (round: Round) => void; onClose: () => void }) => {
    const [round, roundDispatch] = useReducer(roundCreateReducer, { ...initialRoundCreate, campaignId })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [stage, setStage] = useState<Stage>(Stage.CREATE)
    const [taskId, setTaskId] = useState<string>('')
    const [latestTask, setLatestTask] = useState<Task | null>(null)
    const [createdRound, setCreatedRound] = useState<Round | null>(null)

    const createRoundClient = useCallback(async () => {
        setLoading(true)
        try {
            setError(null)
            const newRoundResponse = await createRound(round)
            if (!newRoundResponse) throw new Error('Round creation failed')
            if ('detail' in newRoundResponse) throw new Error(newRoundResponse.detail)
            const newround = newRoundResponse.data as Round
            setCreatedRound(newround)
            setStage(Stage.IMPORT)
        } catch (e) {
            setError((e as Error).message)
        } finally {
            setLoading(false)
        }
    }, [round])

    const distribute = useCallback(async (t: Task) => {
        setLatestTask(t)
        if (!createdRound) throw new Error('Round not created yet')
        if (createdRound.isPublicJury) { setStage(Stage.SUCCESS); return }
        setStage(Stage.DISTRIBUTE)
        const distributionTask = await startDistributionTask(createdRound.roundId, round.jury)
        if ('detail' in distributionTask) throw new Error(distributionTask.detail)
        setTaskId(distributionTask.data.taskId)
    }, [createdRound, round.jury])

    const afterCreatedRound = useMemo(() => {
        if (!createdRound) return null
        if (stage === Stage.IMPORT) {
            return createdRound.dependsOnRoundId
                ? <ImportFromRoundDialog round={createdRound} distribute={distribute} onClose={onClose} />
                : <ImportFromCommonsDialog round={createdRound} onClose={onClose} distribute={distribute} />
        }
        if (stage === Stage.SUCCESS && latestTask) {
            return <Dialog open onClose={onClose}>
                <DialogContent>
                    <Typography>Import successful. Task ID: {latestTask.taskId}</Typography>
                    <Typography>Success: {latestTask.successCount}, Failed: {latestTask.failedCount}</Typography>
                </DialogContent>
                <DialogActions><Button onClick={onClose} variant="outlined" color="error">Close</Button></DialogActions>
            </Dialog>
        }
        return null
    }, [createdRound, distribute, latestTask, onClose, stage])

    return (createdRound && afterCreatedRound) ? afterCreatedRound : (
        <Dialog open={true}
            sx={{ width: { xs: '100%', sm: '80%' }, margin: 'auto', '& .MuiDialog-paper': { width: '100%', maxWidth: '100%' } }}
            slots={{ transition: Transition }} onClose={onClose}>
            <DialogTitle>Create a new round</DialogTitle>
            <DialogContent>
                {error && <Typography variant="h6" color="error" sx={{ m: 2, textAlign: 'center' }}>{error}</Typography>}
                {loading && <LoadingPopup src="/lottie/loading.lottie" />}
                {stage === Stage.CREATE && <React.Suspense fallback={<div>Loading form...</div>}><RoundEditForm {...round} loading={loading} dispatch={roundDispatch} /></React.Suspense>}
                {stage === Stage.DISTRIBUTE && <DistributionStatusThingy taskId={taskId} onSuccess={console.log} />}
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'space-between', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
                <Button onClick={onClose} variant="outlined" color="error" disabled={loading}>Cancel</Button>
                {stage === Stage.CREATE
                    ? <Button onClick={createRoundClient} variant="contained" color="success" disabled={loading} loading={loading}>Create Round</Button>
                    : <Button onClick={onClose} variant="contained" color="error" disabled={loading}>Close</Button>}
            </DialogActions>
        </Dialog>
    )
}

export default CreateRound
