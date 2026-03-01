import { Button, type ButtonProps, IconButton, useMediaQuery } from "@mui/material"
import { Link } from "react-router-dom"

type NokiberButtonProps = {
    startIcon?: React.ReactNode
    endIcon?: React.ReactNode
    smallIcon?: React.ReactNode
    label: string
    onClick?: () => void
    link?: string
    disabled?: boolean
    loading?: boolean
    size?: 'small' | 'medium' | 'large'
    variant?: 'text' | 'outlined' | 'contained'
    color?: 'primary' | 'secondary' | 'error' | 'success' | 'warning' | 'info'
    sx?: ButtonProps['sx']
    className?: string
    alwaysBig?: boolean
}

const NokiberButton = ({
    link,
    endIcon,
    startIcon,
    label,
    onClick,
    disabled = false,
    loading = false,
    size = 'medium',
    variant = 'contained',
    color = 'primary',
    sx,
    className,
    alwaysBig = false,
    smallIcon
}: NokiberButtonProps) => {
    const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'));

    const bigButton = (
        <Button
            variant={variant}
            color={color}
            size={size}
            startIcon={startIcon}
            endIcon={endIcon}
            onClick={onClick}
            disabled={disabled || loading}
            sx={{ ...(sx || {}), cursor: loading ? 'not-allowed' : 'pointer' }}
            className={className}
        >
            {label}
        </Button>
    )

    const smallButton = (
        <IconButton
            disabled={disabled || loading}
            sx={{ ...(sx || {}), cursor: loading ? 'not-allowed' : 'pointer' }}
            className={className}
            onClick={onClick}
            color={color}
        >
            {smallIcon || startIcon || endIcon}
        </IconButton>
    )

    const content = alwaysBig || !isSmall ? bigButton : smallButton

    if (link) {
        return <Link to={link}>{content}</Link>
    }
    return content
}

export default NokiberButton
