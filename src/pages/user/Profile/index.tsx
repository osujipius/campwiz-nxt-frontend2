import {
    Avatar,
    Box,
    Chip,
    Container,
    Divider,
    Paper,
    Stack,
    Tooltip,
    Typography,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import useSession from "@/hooks/useSession";
import usePermissions from "@/hooks/usePermissions";
import { useTranslation } from "react-i18next";

/** Maps a permission name to a human-readable label */
const PERMISSION_LABELS: Record<string, string> = {
    PermissionLogin: "Login",
    PermissionSeeAllUsers: "See All Users",
    PermissionSeeUserDetails: "See User Details",
    PermissionCreateProject: "Create Project",
    PermissionUpdateProject: "Update Project",
    PermissionDeleteProject: "Delete Project",
    PermissionOtherProjectAccess: "Cross-Project Access",
    PermissionCreateCampaign: "Create Campaign",
    PermissionUpdateCampaignDetails: "Update Campaign Details",
    PermissionUpdateCampaignStatus: "Update Campaign Status",
    PermissionDeleteCampaign: "Delete Campaign",
    PermissionApproveRejectCampaign: "Approve / Reject Campaign",
    PermissionCreateRound: "Create Round",
    PermissionUpdateRoundDetails: "Update Round Details",
    PermissionUpdateRoundStatus: "Update Round Status",
    PermissionDeleteRound: "Delete Round",
    PermissionSeeOwnEvaluationResult: "See Own Evaluations",
    PermissionSeeOthersEvaluationResult: "See Others' Evaluations",
    PermissionEvaluateSubmission: "Evaluate Submissions",
    PermissionSubmitSubmission: "Submit Submissions",
    PermissionRandomize: "Randomize",
};

const ProfilePage = () => {
    const { session } = useSession();
    const { isAdmin, isProjectLead, isCoordinator, isJury, isParticipant } = usePermissions();
    const { t } = useTranslation();

    if (!session) return null;

    const commonsProfileUrl = `https://commons.wikimedia.org/wiki/User:${encodeURIComponent(session.username)}`;

    const roles: { label: string; color: "error" | "warning" | "info" | "success" | "default" }[] = [];
    if (isAdmin) roles.push({ label: "Admin", color: "error" });
    else if (isProjectLead) roles.push({ label: "Project Lead", color: "warning" });
    else if (isCoordinator) roles.push({ label: "Coordinator", color: "info" });
    else if (isJury) roles.push({ label: "Jury", color: "success" });
    else if (isParticipant) roles.push({ label: "Participant", color: "default" });

    const formattedDate = session.registeredAt
        ? new Date(session.registeredAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
          })
        : null;

    return (
        <>
            <Header returnTo="/" />
            <Container maxWidth="sm" sx={{ py: 4 }}>
                <Paper
                    sx={{
                        p: 4,
                        borderRadius: 3,
                        boxShadow: 3,
                        textAlign: "center",
                    }}
                >
                    {/* Avatar */}
                    <Avatar
                        src={`https://commons.wikimedia.org/wiki/Special:FilePath/User%3A${encodeURIComponent(session.username)}.jpg`}
                        alt={session.username}
                        sx={{ width: 80, height: 80, mx: "auto", mb: 2, bgcolor: "primary.main" }}
                    >
                        {session.username.charAt(0).toUpperCase()}
                    </Avatar>

                    {/* Username */}
                    <Typography variant="h5" fontWeight="bold" sx={{ fontFamily: "Lora, serif" }}>
                        {session.username}
                    </Typography>

                    {/* Commons profile link */}
                    <Typography
                        component="a"
                        href={commonsProfileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="body2"
                        color="primary"
                        sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, mt: 0.5, textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
                    >
                        View on Wikimedia Commons
                        <OpenInNewIcon fontSize="inherit" />
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    {/* Roles */}
                    {roles.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="overline" color="text.secondary" display="block" gutterBottom>
                                Role
                            </Typography>
                            <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
                                {roles.map((r) => (
                                    <Chip key={r.label} label={r.label} color={r.color} size="small" />
                                ))}
                            </Stack>
                        </Box>
                    )}

                    {/* Project */}
                    {session.projectId && (
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="overline" color="text.secondary" display="block" gutterBottom>
                                {t("project.project")}
                            </Typography>
                            <Chip label={session.projectId} variant="outlined" size="small" />
                        </Box>
                    )}

                    {/* Registered date */}
                    {formattedDate && (
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="overline" color="text.secondary" display="block" gutterBottom>
                                Member since
                            </Typography>
                            <Typography variant="body2">{formattedDate}</Typography>
                        </Box>
                    )}

                    <Divider sx={{ my: 2 }} />

                    {/* Permissions */}
                    <Box>
                        <Typography variant="overline" color="text.secondary" display="block" gutterBottom>
                            Permissions
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center" useFlexGap>
                            {session.permissions.length === 0 && (
                                <Typography variant="body2" color="text.secondary">No permissions assigned</Typography>
                            )}
                            {session.permissions.map((perm) => (
                                <Tooltip key={perm} title={perm} placement="top">
                                    <Chip
                                        label={PERMISSION_LABELS[perm] ?? perm}
                                        size="small"
                                        variant="outlined"
                                        sx={{ mb: 1 }}
                                    />
                                </Tooltip>
                            ))}
                        </Stack>
                    </Box>
                </Paper>
            </Container>
            <Footer />
        </>
    );
};

export default ProfilePage;
