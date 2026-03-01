import type { RoundCreate } from "@/types/round";
import { Checkbox, FormControlLabel, TextField, Typography } from "@mui/material";
import type { ActionDispatch } from "react";

const ArticleRestrictions = ({ dispatch, loading, disabled = false, ...round }: RoundCreate & { dispatch: ActionDispatch<[Partial<RoundCreate>]>; loading: boolean; disabled?: boolean }) => (
    <>
        <Typography variant="h6" component='legend'>Restrictions on Article Submissions</Typography>
        <FormControlLabel control={<Checkbox checked={round.articleAllowCreations} onChange={(e) => dispatch({ articleAllowCreations: e.target.checked })} disabled={loading || disabled} />}
            label={<Typography>Allow articles that were <b>newly created</b>.</Typography>} sx={{ m: 1 }} />
        <FormControlLabel control={<Checkbox checked={round.articleAllowExpansions} onChange={(e) => dispatch({ articleAllowExpansions: e.target.checked })} disabled={loading || disabled} />}
            label={<Typography>Allow articles that were <b>expanded</b>.</Typography>} sx={{ m: 1 }} />
        <br />
        <TextField label="Minimum Total Bytes" variant="outlined" sx={{ m: 1, display: 'inline-block' }} onChange={(e) => dispatch({ articleMinimumTotalBytes: e.target.value as unknown as number })} value={round.articleMinimumTotalBytes} disabled={loading || disabled} />
        <TextField label="Minimum Total Words" variant="outlined" sx={{ m: 1, display: 'inline-block' }} onChange={(e) => dispatch({ articleMinimumTotalWords: e.target.value as unknown as number })} value={round.articleMinimumTotalWords} disabled={loading || disabled} />
        <TextField label="Minimum Added Bytes" variant="outlined" sx={{ m: 1, display: 'inline-block' }} onChange={(e) => dispatch({ articleMinimumAddedBytes: e.target.value as unknown as number })} value={round.articleMinimumAddedBytes} disabled={loading || disabled} />
        <TextField label="Minimum Added Words" variant="outlined" sx={{ m: 1, display: 'inline-block' }} onChange={(e) => dispatch({ articleMinimumAddedWords: e.target.value as unknown as number })} value={round.articleMinimumAddedWords} disabled={loading || disabled} />
    </>
)

export default ArticleRestrictions
