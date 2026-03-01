import type { Round } from "@/types/round"
import { Button, Dialog, DialogActions, Typography } from "@mui/material"
import Backward from '@mui/icons-material/ArrowBackIosNew';
import RightArrowIcon from '@mui/icons-material/ArrowForward';
import LottieWrapper from "@/components/LottieWrapper";

type RoundCreationSuccessProps = {
    onClose: () => void
    round: Round
    nextStepLabel: string
    nextStepAction: (round: Round) => void
}

const RoundCreationSuccess = ({ onClose, round: c, nextStepLabel, nextStepAction }: RoundCreationSuccessProps) => {
    return (
        <Dialog sx={{ padding: 2, textAlign: 'center' }} open={true} onClose={onClose}>
            <LottieWrapper src='/lottie/success.lottie' />
            <Typography variant="h5" sx={{ mb: 2, textAlign: 'center' }}>
                Round Created Successfully
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 2, textAlign: 'center' }}>
                Round {c.name} has been created with id <b>{c.roundId}</b>
            </Typography>
            <DialogActions>
                <Button onClick={onClose} startIcon={<Backward />} variant="outlined" color="error">Close</Button>
                <Button onClick={() => nextStepAction(c)} endIcon={<RightArrowIcon />} variant="contained" color="success">{nextStepLabel}</Button>
            </DialogActions>
        </Dialog>
    )
}

export default RoundCreationSuccess
