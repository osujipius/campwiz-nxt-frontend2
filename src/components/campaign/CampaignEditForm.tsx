import { initialCampaignCreate, type CampaignCreate } from "@/types/campaign/create";
import { Autocomplete, FormControlLabel, TextField, Typography } from "@mui/material";
import { type ActionDispatch } from "react";
import CheckBox from '@mui/material/Checkbox';
import type { TFunction } from "i18next";

const CampaignEditForm = ({ dispatch, loading, disabled = false, disableOnPrivate = false, t, ...campaign }: CampaignCreate & { dispatch: ActionDispatch<[Partial<CampaignCreate>]>, loading: boolean, disabled?: boolean, disableOnPrivate?: boolean, t: TFunction }) => {
    return (
        <>
            <TextField
                label={t('campaign.name')}
                variant="outlined"
                sx={{ mb: 2, width: '100%' }}
                onChange={(e) => dispatch({ name: e.target.value })}
                value={campaign.name}
                disabled={loading || disabled}
            />
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, flexFlow: 'wrap' }}>
                <Autocomplete
                    options={['commons']}
                    renderInput={(params) => <TextField {...params} label={t('campaign.wikiProject')} variant="outlined" />}
                    sx={{ width: { xs: '100%', sm: '40%' }, mb: 1 }}
                    value={campaign.language}
                    onChange={(_e, value) => dispatch({ language: value as string })}
                    disabled={loading || disabled}
                />
                <TextField
                    type="date"
                    onChange={(e) => dispatch({ startDate: new Date(e.target.value).toISOString() })}
                    value={campaign.startDate ? campaign.startDate.split('T')[0] : ''}
                    sx={{ width: { xs: '100%', sm: '27%' }, mb: 1 }}
                    label={t('campaign.startDate')}
                    disabled={loading || disabled}
                    slotProps={{ inputLabel: { shrink: true } }}
                />
                <TextField
                    type="date"
                    onChange={(e) => dispatch({ endDate: new Date(e.target.value).toISOString() })}
                    value={campaign.endDate ? campaign.endDate.split('T')[0] : ''}
                    sx={{ width: { xs: '100%', sm: '27%' }, mb: 1 }}
                    label={t('campaign.endDate')}
                    disabled={loading || disabled}
                    slotProps={{ inputLabel: { shrink: true } }}
                />
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flexFlow: 'wrap' }}>
                <TextField
                    label={t('campaign.description')}
                    variant="outlined"
                    sx={{ mb: 1, width: { xs: '100%', sm: '49%' } }}
                    onChange={(e) => dispatch({ description: e.target.value })}
                    value={campaign.description}
                    multiline
                    minRows={4}
                    disabled={loading || disabled}
                />
                <TextField
                    label={t('campaign.rules')}
                    variant="outlined"
                    sx={{ mb: 1, width: { xs: '100%', sm: '49%' } }}
                    onChange={(e) => dispatch({ rules: e.target.value })}
                    value={campaign.rules}
                    multiline
                    minRows={4}
                    disabled={loading || disabled}
                />
            </div>
            <FormControlLabel
                control={
                    <CheckBox
                        checked={campaign.isPublic}
                        onChange={(e) => dispatch({ isPublic: e.target.checked })}
                        disabled={loading || disabled}
                    />
                }
                disabled={disableOnPrivate && !initialCampaignCreate.isPublic}
                sx={{ my: 2 }}
                label={
                    <Typography variant="body1" color="textSecondary">
                        {t('campaign.publicVisibilityDisclaimer')}
                    </Typography>
                }
            />
        </>
    );
}

export default CampaignEditForm;
