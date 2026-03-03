import type { RoundCreate } from "@/types/round";
import { TextField, Typography } from "@mui/material";
import type { ActionDispatch } from "react";

const AudioRestrictions = ({ dispatch, loading, disabled = false, ...round }: RoundCreate & { dispatch: ActionDispatch<[Partial<RoundCreate>]>; loading: boolean; disabled?: boolean }) => (
    <>
        <Typography variant="h6" component='legend'>Restrictions on Audios</Typography>
        <TextField label="Minimum Audio Duration (ms)" variant="outlined" sx={{ m: 1, display: 'inline-block' }} onChange={(e) => dispatch({ audioMinimumDurationMilliseconds: e.target.value as unknown as number })} value={round.audioMinimumDurationMilliseconds} disabled={loading || disabled} />
        <TextField label="Minimum Audio Size (Bytes)" variant="outlined" sx={{ m: 1, display: 'inline-block' }} onChange={(e) => dispatch({ audioMinimumSizeBytes: e.target.value as unknown as number })} value={round.audioMinimumSizeBytes} disabled={loading || disabled} />
    </>
)

export default AudioRestrictions
