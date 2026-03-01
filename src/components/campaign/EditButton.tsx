import EditIcon from '@mui/icons-material/Edit';
import NokiberButton from "@/components/NokiberButton";
import { useTranslation } from 'react-i18next';

const EditButton = ({ campaignId }: { campaignId: string }) => {
    const { t } = useTranslation();
    return (
        <NokiberButton
            label={t('campaign.edit')}
            link={`/campaign/${campaignId}/edit`}
            startIcon={<EditIcon />}
            variant="outlined"
        />
    );
}

export default EditButton
