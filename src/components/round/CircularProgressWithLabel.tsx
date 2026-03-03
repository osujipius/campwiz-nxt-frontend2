import { CircularProgress, type CircularProgressProps, Typography } from "@mui/material";

type Variant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2' | 'caption' | 'button' | 'overline' | 'inherit';

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
