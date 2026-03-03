import type { Round } from "@/types/round"
import type { RoundStatus } from "@/types/round/status"
import React from "react"
import { updateRoundStatus } from "@/api/campaign"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, LinearProgress, Typography } from "@mui/material"
import type { TFunction } from "i18next"

type ChangeStatusButtonProps = {
    status: RoundStatus
    label: string
    color: 'success' | 'error'
    icon: React.ReactNode
    description: string
    onClick?: (round: Round) => void
    roundId: string
    refresh?: () => void
    statusText?: string
    t: TFunction
}

const ChangeStatusButton = ({ roundId, onClick, status, label, color, description, icon, refresh, statusText, t }: ChangeStatusButtonProps) => {
    const [showDialog, setShowDialog] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const doThing = async () => {
        try {
            setLoading(true)
            const res = await updateRoundStatus(roundId, status)
            if ('detail' in res) throw new Error(res.detail)
            setShowDialog(false)
            if (onClick) onClick(res.data as Round)
            if (refresh) refresh()
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    return <>
        <Button startIcon={icon} variant="contained" color={color} onClick={() => setShowDialog(true)}
            sx={{ m: 1, px: 3, borderRadius: 7 }} loading={loading} disabled={showDialog}>
            {label}
        </Button>
        <React.Suspense fallback={<LinearProgress />}>
            {showDialog && <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
                <DialogTitle>{label}</DialogTitle>
                <DialogContent>
                    <Typography>{t('round.confirmChangeStatus', { status: t(`round.status.${statusText || status}`) })}</Typography>
                    <Typography>{description}</Typography>
                    {loading && <LinearProgress />}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowDialog(false)} variant="outlined" color="error" disabled={loading}>{t('no')}</Button>
                    <Button onClick={doThing} variant="contained" color="success" disabled={loading} loading={loading}>{t('yes')}</Button>
                </DialogActions>
            </Dialog>}
        </React.Suspense>
    </>
}

export default ChangeStatusButton
