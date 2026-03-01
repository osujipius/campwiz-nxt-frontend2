import Typography from "@mui/material/Typography";
import DescriptionIcon from '@mui/icons-material/Description'

const Description = ({ description, label = 'Guidelines', Icon = DescriptionIcon }: { description: string, label?: string, Icon?: React.ElementType }) => {
    return <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'left' }}>
        <Icon sx={{ display: 'inline-block', mr: 1 }} fontSize="large" />
        <div style={{ display: 'inline-block' }}>
            <Typography variant="h6" sx={{ mb: 0 }} component='div'>
                {label}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, mt: -0.5, overflowWrap: 'anywhere', textWrap: 'balance', wordWrap: 'break-word' }} component='div'>
                {description}
            </Typography>
        </div>
    </div>
}

export default Description
