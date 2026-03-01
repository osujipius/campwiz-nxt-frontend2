import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material"
import { updateRound } from "@/api/round"
import React, { lazy, useCallback, useMemo, useReducer, useState } from "react"
import { roundCreateReducer } from "@/types/round/create"
import type { Round } from "@/types/round"
import LoadingPopup from "@/components/LoadingPopup"
import Slide from '@mui/material/Slide'
import type { TransitionProps } from '@mui/material/transitions'
import DistributionDialog from "./DistributionDialog"

const RoundEditForm = lazy(() => import("@/components/round/RoundEditForm"))

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement<unknown> },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
})

enum Stage { EDIT = 'edit', DISTRIBUTE = 'distribute', SUCCESS = 'success' }

const EditDialog = ({ campaignId, onClose, existingRound, setUpdatedRound, setStage }: {
    campaignId: string; onClose: () => void; existingRound: Round
    setUpdatedRound: (round: Round) => void; setStage: (stage: Stage) => void
}) => {
    const [round, roundDispatch] = useReducer(roundCreateReducer, { ...existingRound, jury: Object.values(existingRound?.jury || {}), campaignId })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const needRedistribution = useMemo(() => {
        if (round.isPublicJury) return false
        if (existingRound.quorum !== round.quorum) return true
        const existingJury = new Set(Object.values(existingRound.jury || {}))
        if (round.jury.length !== existingJury.size) return true
        const newJury = new Set(round.jury || [])
        let matchCount = 0
        for (const j of existingJury) { if (newJury.has(j)) matchCount++ }
        return matchCount !== existingJury.size
    }, [existingRound.jury, existingRound.quorum, round.isPublicJury, round.jury, round.quorum])

    const updateRoundClient = useCallback(async () => {
        setLoading(true)
        try {
            setError(null)
            const updatedRoundResponse = await updateRound(existingRound.roundId, round)
            if (!updatedRoundResponse) throw new Error('Round update failed')
            if ('detail' in updatedRoundResponse) throw new Error(updatedRoundResponse.detail)
            const updated = updatedRoundResponse.data as Round
            setUpdatedRound(updated)
            setStage(needRedistribution ? Stage.DISTRIBUTE : Stage.SUCCESS)
        } catch (e) {
            setError((e as Error).message)
        } finally {
            setLoading(false)
        }
    }, [existingRound.roundId, needRedistribution, round, setStage, setUpdatedRound])

    return (
        <Dialog open={true}
            sx={{ width: { xs: '100%', sm: '80%' }, margin: 'auto', '& .MuiDialog-paper': { width: '100%', maxWidth: '100%' } }}
            slots={{ transition: Transition }} onClose={onClose}>
            <DialogTitle sx={{ textAlign: 'center' }} component="h2" variant="h4">Update Round</DialogTitle>
            <DialogContent>
                {error && <Typography variant="h6" color="error" sx={{ m: 2, textAlign: 'center' }}>{error}</Typography>}
                {loading && <LoadingPopup src="/lottie/loading.lottie" />}
                <React.Suspense fallback={<div>Loading form...</div>}>
                    <RoundEditForm {...round} loading={loading} dispatch={roundDispatch} hideAdvanced />
                </React.Suspense>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'space-between', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
                <Button onClick={onClose} variant="outlined" color="error" disabled={loading}>Cancel</Button>
                <Button onClick={updateRoundClient} variant="contained" color="success" disabled={loading}>
                    <CircularProgress size={24} color="inherit" sx={{ display: loading ? 'inline-block' : 'none', mr: 1 }} />
                    Update Round
                </Button>
            </DialogActions>
        </Dialog>
    )
}

const EditRound = ({ campaignId, onClose, existingRound }: {
    campaignId: string; onAfterCreationSuccess: (round: Round) => void; onClose: () => void; existingRound: Round
}) => {
    const [stage, setStage] = useState<Stage>(Stage.EDIT)
    const [updatedRound, setUpdatedRound] = useState<Round | null>(null)

    return stage === Stage.EDIT
        ? <EditDialog campaignId={campaignId} onClose={onClose} existingRound={existingRound} setUpdatedRound={setUpdatedRound} setStage={setStage} />
        : stage === Stage.DISTRIBUTE
            ? <DistributionDialog roundId={updatedRound?.roundId || ''} juries={Object.values(updatedRound?.jury || {})}
                afterDistribution={() => setStage(Stage.SUCCESS)} onClose={onClose} />
            : stage === Stage.SUCCESS
                ? <Dialog open onClose={onClose}>
                    <DialogTitle sx={{ textAlign: 'center' }} component="h2" variant="h4">Round Updated</DialogTitle>
                    <DialogContent><Typography variant="h6" sx={{ m: 2, textAlign: 'center' }}>Round has been successfully updated</Typography></DialogContent>
                    <DialogActions sx={{ justifyContent: 'center' }}><Button onClick={onClose} variant="contained" color="success">Close</Button></DialogActions>
                </Dialog>
                : null
}

export default EditRound
