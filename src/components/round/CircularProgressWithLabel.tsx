import { CircularProgress, type CircularProgressProps, Typography } from "@mui/material";
import type { Variant } from "@mui/material/styles/createTypography";

function CircularProgressWithLabel(
    props: CircularProgressProps & { value: number; labelVariant?: Variant },
) {
    return (
        <div style={{ position: 'relative', display: 'inline-flex', margin: '10px' }}>
            <CircularProgress variant="determinate" {...props} />
            <div style={{
                top: 0, left: 0, bottom: 0, right: 0,
                position: 'absolute', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
            }}>
                <Typography
                    variant={props.labelVariant ?? 'h4'}
                    component="div"
                    color={props.color}
                >{`${Math.round(props.value)}%`}</Typography>
            </div>
        </div>
    );
}

export default CircularProgressWithLabel
