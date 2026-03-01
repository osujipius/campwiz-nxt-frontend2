import type { Project } from "@/types/project";
import { Button, Card, CardActions, CardContent, CardHeader, CardMedia, Chip, Typography } from "@mui/material";
import { styled } from '@mui/material/styles';
import { Link } from "react-router-dom";
import RightArrowIcon from '@mui/icons-material/KeyboardArrowRight';
import { useTranslation } from "react-i18next";

type SingleProjectChipProps = {
    project: Project
}

const StyledCard = styled(Card)`
  ${({ theme }) => `
  cursor: pointer;
  transition: ${theme.transitions.create(['transform'], {
    duration: theme.transitions.duration.standard,
})};
  &:hover {
    transform: scale(1.05);
  }
  `}
`;

const SingleProjectChip = ({ project }: SingleProjectChipProps) => {
    const { t } = useTranslation()
    return (
        <StyledCard sx={{
            cursor: 'pointer',
            boxShadow: 1, margin: 1, p: 2,
            display: 'inline-block',
            borderRadius: 8,
            '&:hover': {
                boxShadow: 3
            },
            width: {
                xs: 'calc(95% - 4px)',
                sm: 'calc(50% - 4px)',
                md: 'calc(33.33% - 4px)',
                lg: 'calc(30% - 4px)',
                xl: 'calc(28% - 4px)',
            },
            mx: 2,
        }}>
            <CardMedia
                component="img"
                image={project.logoUrl}
                alt={project.name}
                sx={{
                    objectFit: 'cover',
                    borderRadius: 8,
                    height: '100px',
                    maxWidth: '100%',
                }}
            />
            <CardHeader
                title={<>
                    <Typography variant="h5" color='primary' style={{ display: 'inline', marginRight: '8px' }}>{project.name}</Typography>
                    <Typography variant="subtitle2" color="textSecondary" style={{ display: 'inline' }}>
                        ({project.projectId})
                    </Typography>
                </>}
                sx={{ mb: -1 }}
            />
            <CardContent>
                {t('project.leads')}&nbsp;:
                {project.projectLeads.map((lead, index) => (
                    <Chip key={index} label={lead} sx={{ m: 0.5 }} />
                ))}
            </CardContent>
            <CardActions sx={{ justifyContent: 'space-between' }}>
                <Link to={`/project/${project.projectId}`}>
                    <Button color="primary" endIcon={<RightArrowIcon />} variant="outlined" sx={{ borderRadius: 8, px: 2 }}>
                        {t('project.goToProject')}
                    </Button>
                </Link>
            </CardActions>
        </StyledCard>
    )
}

export default SingleProjectChip;
