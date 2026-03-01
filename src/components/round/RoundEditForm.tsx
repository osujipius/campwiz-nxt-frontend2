import { EvaluationType, MediaType, type RoundCreate } from "@/types/round";
import { Button, Checkbox, Divider, FormControlLabel, FormGroup, LinearProgress, MenuItem, Slider, TextField, Typography } from "@mui/material";
import { lazy, Suspense, useState, type ActionDispatch } from "react";
import AudioIcon from "@mui/icons-material/AudioFile";
import VideoIcon from "@mui/icons-material/VideoLibrary";
import BitmapIcon from "@mui/icons-material/Image";
import UserInput from "@/components/user/UserInput";
import Diversity3Icon from '@mui/icons-material/Diversity3';
import Collapse from '@mui/material/Collapse';
import SettingsIcon from '@mui/icons-material/Settings';

const ArticleRestrictions = lazy(() => import('./RestrictionsArticle'));
const ImageRestrictions = lazy(() => import('./RestrictionsImage'));
const VideoRestrictions = lazy(() => import('./RestrictionsVideo'));
const AudioRestrictions = lazy(() => import('./RestrictionsAudio'));

const RoundEditForm = ({ dispatch, loading, disabled = false, hideAdvanced = false, ...round }: RoundCreate & { dispatch: ActionDispatch<[Partial<RoundCreate>]>; loading: boolean; disabled?: boolean; hideAdvanced?: boolean }) => {
    const allowedAudio = round.allowedMediaTypes.includes(MediaType.AUDIO);
    const allowedImage = round.allowedMediaTypes.includes(MediaType.IMAGE);
    const allowedVideo = round.allowedMediaTypes.includes(MediaType.VIDEO);
    const allowedArticle = round.allowedMediaTypes.includes(MediaType.ARTICLE);
    const [advancedMode, setAdvancedMode] = useState(false);
    const maxQuorum = round.isPublicJury ? 25 : Math.max(round.jury.length, 1);

    return (
        <>
            <FormGroup sx={{ display: 'block', m: 1 }}>
                <TextField label="Round Type" variant="outlined" select
                    value={round.isPublicJury ? 'Public' : 'Private'}
                    onChange={(e) => dispatch({ isPublicJury: e.target.value === 'Public' })}
                    sx={{ m: 1, width: { xs: '100%', sm: '20%' } }}
                    disabled={loading || disabled}
                >
                    <MenuItem value='Public'>Public</MenuItem>
                    <MenuItem value='Private'>Private</MenuItem>
                </TextField>
                <TextField label="Evaluation Type" variant="outlined" select
                    value={round.type}
                    onChange={(e) => dispatch({ type: e.target.value as EvaluationType })}
                    sx={{ m: 1, width: { xs: '100%', sm: '20%' } }}
                    disabled={loading || disabled}
                >
                    <MenuItem value={EvaluationType.BINARY}>Yes / No</MenuItem>
                    <MenuItem value={EvaluationType.SCORE}>Rating (1 - 5)</MenuItem>
                    <MenuItem value={EvaluationType.RANKING}>Ranking</MenuItem>
                </TextField>
                <FormControlLabel control={<Checkbox checked={round.allowJuryToParticipate} onChange={(e) => dispatch({ allowJuryToParticipate: e.target.checked })} disabled={loading || disabled} />}
                    label={<Typography variant="body1"><Diversity3Icon /> Allow the members of the jury to participate on this round.</Typography>}
                    sx={{ m: 1 }}
                />
            </FormGroup>
            <TextField label="Name" variant="outlined"
                sx={{ m: 1, width: { xs: '100%', sm: '48%' } }}
                onChange={(e) => dispatch({ name: e.target.value })} value={round.name}
                disabled={loading || disabled}
            />
            <TextField label="Deadline" type="date"
                sx={{ m: 1, width: { xs: '100%', sm: '48%' } }}
                onChange={(e) => dispatch({ endDate: new Date(e.target.value).toISOString() })}
                value={round.endDate ? round.endDate.split('T')[0] : ''}
                disabled={loading || disabled}
                slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField label="Guidelines" variant="outlined"
                sx={{ m: 1, width: { xs: '100%', sm: '48%' } }}
                onChange={(e) => dispatch({ description: e.target.value })} value={round.description}
                multiline disabled={loading || disabled}
            />
            {!round.isPublicJury && <UserInput
                value={round.jury}
                onChange={(jury) => dispatch({ jury, quorum: Math.min(round.quorum, jury.length) })}
                label="Jury"
                disabled={loading || disabled}
                sx={{ m: 1, width: { xs: '100%', sm: '48%' }, display: 'inline-block' }}
            />}
            <Divider />
            <FormGroup sx={{ m: 1, p: 1, display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly', alignItems: 'center' }}>
                <Typography>Allowed Submission Types:</Typography>
                <FormControlLabel control={<Checkbox checked={allowedImage} onChange={(e) => dispatch({ allowedMediaTypes: e.target.checked ? [...round.allowedMediaTypes, MediaType.IMAGE] : round.allowedMediaTypes.filter((t) => t !== MediaType.IMAGE) })} disabled={loading || disabled} />}
                    label={<Typography variant="body1"><BitmapIcon /> Image</Typography>} sx={{ m: 1 }} />
                <FormControlLabel control={<Checkbox checked={allowedAudio} onChange={(e) => dispatch({ allowedMediaTypes: e.target.checked ? [...round.allowedMediaTypes, MediaType.AUDIO] : round.allowedMediaTypes.filter((t) => t !== MediaType.AUDIO) })} disabled={loading || disabled} />}
                    label={<Typography variant="body1"><AudioIcon /> Audio</Typography>} sx={{ m: 1 }} />
                <FormControlLabel control={<Checkbox checked={allowedVideo} onChange={(e) => dispatch({ allowedMediaTypes: e.target.checked ? [...round.allowedMediaTypes, MediaType.VIDEO] : round.allowedMediaTypes.filter((t) => t !== MediaType.VIDEO) })} disabled={loading || disabled} />}
                    label={<Typography variant="body1"><VideoIcon /> Video</Typography>} sx={{ m: 1 }} />
            </FormGroup>
            <FormGroup sx={{ display: 'block', m: 1 }}>
                <Typography variant="body1">Quorum: {round.quorum} jury per Submission</Typography>
                <Slider min={1} size='medium' max={maxQuorum} marks valueLabelDisplay='on'
                    value={round.quorum || 1} onChange={(_, value) => dispatch({ quorum: value as number })} />
            </FormGroup>
            <Divider />
            {!hideAdvanced && <>
                <Button startIcon={<SettingsIcon />} variant="outlined" color="warning" onClick={() => setAdvancedMode(!advancedMode)} sx={{ m: 1 }}>
                    Advanced Settings
                </Button>
                <Suspense fallback={<LinearProgress />}>
                    <Collapse in={advancedMode} component='div' sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly', alignItems: 'center' }}>
                        {allowedArticle && <fieldset style={{ border: '1px solid grey', padding: '8px', display: 'inline-block', margin: '5px' }}><ArticleRestrictions {...round} dispatch={dispatch} loading={loading} disabled={disabled} /></fieldset>}
                        {allowedImage && <fieldset style={{ border: '1px solid grey', padding: '8px', display: 'inline-block', margin: '5px' }}><ImageRestrictions {...round} dispatch={dispatch} loading={loading} disabled={disabled} /></fieldset>}
                        {allowedAudio && <fieldset style={{ border: '1px solid grey', padding: '8px', display: 'inline-block', margin: '5px' }}><AudioRestrictions {...round} dispatch={dispatch} loading={loading} disabled={disabled} /></fieldset>}
                        {allowedVideo && <fieldset style={{ border: '1px solid grey', padding: '8px', display: 'inline-block', margin: '5px' }}><VideoRestrictions {...round} dispatch={dispatch} loading={loading} disabled={disabled} /></fieldset>}
                    </Collapse>
                </Suspense>
            </>}
        </>
    );
}

export default RoundEditForm
