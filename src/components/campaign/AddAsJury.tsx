import { Button } from "@mui/material"
import AddIcon from '@mui/icons-material/Add';
import { addMyselfAsPublicJury } from "@/api/campaign";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const AddAsJuryButton = ({ roundId, refresh }: { roundId: string; refresh: () => void }) => {
    const [adding, setAdding] = useState(false);
    const { t } = useTranslation();

    const submit = async () => {
        try {
            setAdding(true);
            const resp = await addMyselfAsPublicJury(roundId);
            if ('detail' in resp) throw new Error(resp.detail)
            refresh();
        } finally {
            setAdding(false);
        }
    }

    return (
        <Button startIcon={<AddIcon />} variant="contained" color="success"
            disabled={adding} loading={adding} onClick={submit}
            sx={{ m: 1, px: 3, borderRadius: 3 }}>
            {t('round.addMyselfAsJury')}
        </Button>
    )
}

export default AddAsJuryButton
