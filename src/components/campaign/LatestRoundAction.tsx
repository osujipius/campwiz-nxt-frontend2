import StopIcon from '@mui/icons-material/Pause';
import Start from '@mui/icons-material/PlayArrow';
import DoubleTickIcon from '@mui/icons-material/DoneAll';
import { Link } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import JudgeIcon from '@mui/icons-material/HowToVote';
import { RoundStatus } from "@/types/round/status";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import React from 'react';
import type { Round } from '@/types/round';
import type { Campaign } from '@/types/campaign';
import PublishIcon from '@mui/icons-material/Publish';
import SelectedRoundActionStatus from '@/types/campaign/SelectedActionStatus';
import ExportToCSVButton from './ExportButton';
import ChangeStatusButton from './ChangeStatusButton';
import DeleteButton from './DeleteButton';
import AddAsJuryButton from './AddAsJury';
import CategoryIcon from '@mui/icons-material/Category';
import { updateRoundStatus } from '@/api/campaign';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';

const CreateRoundButton = ({ onClick }: { onClick: () => void }) => {
    const { t } = useTranslation();
    return <Button startIcon={<Add />} variant="contained" color="primary" onClick={onClick} sx={{ m: 1, px: 3, borderRadius: 3 }}>{t('round.createRound')}</Button>
}

const EditRoundButton = ({ onClick }: { onClick: () => void }) => {
    const { t } = useTranslation();
    return <Button startIcon={<EditIcon />} variant="contained" color="primary" onClick={onClick} sx={{ m: 1, px: 3 }}>{t('round.editRound')}</Button>
}

const MarkAsCompleteButton = ({ latestRound, setAction, refresh, t }: { latestRound: Round | null; setAction: (action: SelectedRoundActionStatus) => void; refresh: () => void; t: TFunction }) => {
    if (!latestRound) return null
    if (!([RoundStatus.ACTIVE, RoundStatus.PAUSED] as string[]).includes(latestRound.status)) return null

    if (latestRound.status === RoundStatus.PAUSED)
        return <ChangeStatusButton roundId={latestRound.roundId} color="success" description="" icon={<DoubleTickIcon />} label={t('round.markAsComplete')}
            status={RoundStatus.COMPLETED} statusText={t('round.status.COMPLETED')} onClick={() => setAction(SelectedRoundActionStatus.finalizing)} refresh={refresh} t={t} />

    const markAsComplete = async (round: Round) => {
        setAction(SelectedRoundActionStatus.finalizing)
        await updateRoundStatus(round.roundId, RoundStatus.COMPLETED)
        setAction(SelectedRoundActionStatus.finalizing)
        refresh()
    }
    return <ChangeStatusButton roundId={latestRound.roundId} color="success" description="" icon={<DoubleTickIcon />} label={t('round.markAsComplete')}
        status={RoundStatus.PAUSED} statusText={t('round.status.pausedThenCompleted')} onClick={markAsComplete} t={t} />
}

const LatestRoundActions = ({ latestRound, setAction, isJury, judgableLink, refresh, isCoordinator, categorizerAvailable }: {
    latestRound: Round | null; campaign: Campaign; action: SelectedRoundActionStatus
    setAction: (action: SelectedRoundActionStatus) => void; isJury: boolean; judgableLink: string
    refresh: () => void; isCoordinator: boolean; categorizerAvailable?: boolean
}) => {
    const { t } = useTranslation();
    const buttons: React.ReactNode[] = []

    if (latestRound && latestRound.status === RoundStatus.ACTIVE) {
        if (isJury)
            buttons.push(<Link to={judgableLink} key="judge"><Button startIcon={<JudgeIcon />} variant="contained" color="primary" sx={{ m: 1, px: 3, borderRadius: 3 }}>{t('round.evaluationArea')}</Button></Link>)
        else if (latestRound.isPublicJury)
            buttons.push(<AddAsJuryButton key="addJury" roundId={latestRound.roundId} refresh={refresh} />)
        if (categorizerAvailable)
            buttons.push(<Link to={`/campaign/${latestRound.campaignId}/categorizer`} key="categorizer"><Button startIcon={<CategoryIcon />} variant="contained" color="primary" sx={{ m: 1, px: 3, borderRadius: 3 }}>{t('round.categorizer')}</Button></Link>)
    }

    if (isCoordinator) {
        if (!latestRound) {
            buttons.push(<CreateRoundButton key="create" onClick={() => setAction(SelectedRoundActionStatus.creating)} />)
        } else {
            if (latestRound.status !== RoundStatus.COMPLETED && latestRound.totalSubmissions === latestRound.totalEvaluatedSubmissions)
                buttons.push(<MarkAsCompleteButton key="complete" latestRound={latestRound} setAction={setAction} refresh={refresh} t={t} />)
            if (latestRound.status === RoundStatus.COMPLETED) {
                buttons.push(<ExportToCSVButton key="export" roundId={latestRound.roundId} />)
                buttons.push(<CreateRoundButton key="createNew" onClick={() => setAction(SelectedRoundActionStatus.creating)} />)
            } else if (latestRound.status === RoundStatus.ACTIVE) {
                buttons.push(<ChangeStatusButton key="pause" roundId={latestRound.roundId} color="error" description="" icon={<StopIcon />} label="Pause" status={RoundStatus.PAUSED} onClick={() => setAction(SelectedRoundActionStatus.finalizing)} refresh={refresh} t={t} />)
            } else if (latestRound.status === RoundStatus.PAUSED) {
                buttons.push(<DeleteButton key="delete" roundId={latestRound.roundId} refresh={refresh} t={t} />)
                if (latestRound.totalSubmissions === 0)
                    buttons.push(<Button key="import" startIcon={<PublishIcon />} variant="contained" color="primary" onClick={() => setAction(SelectedRoundActionStatus.importing)} sx={{ m: 1, px: 3 }}>Import</Button>)
                buttons.push(<EditRoundButton key="edit" onClick={() => setAction(SelectedRoundActionStatus.editing)} />)
                buttons.push(<ChangeStatusButton key="start" roundId={latestRound.roundId} color="error" description="" icon={<Start />} label="Start" status={RoundStatus.ACTIVE} onClick={() => setAction(SelectedRoundActionStatus.finalizing)} refresh={refresh} t={t} />)
            }
        }
    }

    return (
        <div style={{ textAlign: 'right' }}>
            {buttons.map((button, i) => <React.Fragment key={i}>{button}</React.Fragment>)}
        </div>
    )
}

export default LatestRoundActions
