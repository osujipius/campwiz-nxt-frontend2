import GroupsIcon from '@mui/icons-material/Groups';
import Typography from '@mui/material/Typography';
import type { TFunction } from 'i18next';

const Quorum = ({ quorum, t }: { quorum: number; t: TFunction }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'left' }}>
            <GroupsIcon sx={{ display: 'inline-block', mr: 1 }} fontSize="large" />
            <div style={{ display: 'inline-block' }}>
                <Typography variant="h6" sx={{ mb: 0 }} component='div'>
                    {t('round.quorum')}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2, mt: -0.5 }} component='div'>
                    {t('round.quorumRequired', { count: quorum })}
                </Typography>
            </div>
        </div>
    );
}

export default Quorum
