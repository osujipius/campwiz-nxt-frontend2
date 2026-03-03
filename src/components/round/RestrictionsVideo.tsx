import type { RoundCreate } from "@/types/round";
import { TextField, Typography } from "@mui/material";
import type { ActionDispatch } from "react";

const VideoRestrictions = ({ dispatch, loading, disabled = false, ...round }: RoundCreate & { dispatch: ActionDispatch<[Partial<RoundCreate>]>; loading: boolean; disabled?: boolean }) => (
    <>
        <Typography variant="h6" component='legend'>Restrictions on Videos</Typography>
        <TextField label="Minimum Video Resolution" variant="outlined" sx={{ m: 1, display: 'inline-block' }} onChange={(e) => dispatch({ videoMinimumResolution: e.target.value as unknown as number })} value={round.videoMinimumResolution} disabled={loading || disabled} />
        <TextField label="Minimum Video Size (Bytes)" variant="outlined" sx={{ m: 1, display: 'inline-block' }} onChange={(e) => dispatch({ videoMinimumSizeBytes: e.target.value as unknown as number })} value={round.videoMinimumSizeBytes} disabled={loading || disabled} />
        <TextField label="Minimum Video Duration (ms)" variant="outlined" sx={{ m: 1, display: 'inline-block' }} onChange={(e) => dispatch({ videoMinimumDurationMilliseconds: e.target.value as unknown as number })} value={round.videoMinimumDurationMilliseconds} disabled={loading || disabled} />
    </>
)

export default VideoRestrictions
