import { Paper, Typography } from '@mui/material'

export default function NotFound() {
    return (
        <Paper
            sx={{
                padding: 2,
                textAlign: 'center',
                my: 2,
                height: '80%',
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                pt: 5,
            }}
        >
            <img
                src="/molumen-red-square-error-warning-icon.svg"
                alt="Error"
                style={{
                    width: 200,
                    height: 'auto',
                    margin: 'auto',
                    position: 'relative',
                    marginTop: 20,
                    marginBottom: 20,
                }}
            />
            <Typography variant="h2">Not Found</Typography>
            <Typography variant="body1">
                The Page you were looking for was not found. Sorry about that.
            </Typography>
        </Paper>
    )
}
