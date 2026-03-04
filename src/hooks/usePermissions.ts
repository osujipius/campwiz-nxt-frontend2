import useSession from "@/hooks/useSession";
import type { PermissionName } from "@/types/session";

/**
 * Hook to check user permissions and roles.
 * Infers roles from the flat permissions[] array returned by /user/me.
 */
const usePermissions = () => {
    const { session } = useSession();

    /** Returns true if the user has the specified named permission */
    const hasPermission = (name: PermissionName): boolean => {
        if (!session) return false;
        return session.permissions.includes(name);
    };

    // ---- Composite role helpers ----

    /** Admin: can access projects other than their own */
    const isAdmin = hasPermission('PermissionOtherProjectAccess');

    /** Project Lead: can approve/reject campaigns or create projects */
    const isProjectLead = isAdmin ||
        hasPermission('PermissionApproveRejectCampaign') ||
        hasPermission('PermissionCreateProject');

    /** Coordinator: can manage rounds within a campaign */
    const isCoordinator = isAdmin ||
        isProjectLead ||
        hasPermission('PermissionCreateRound') ||
        hasPermission('PermissionUpdateRoundDetails');

    /** Jury: can evaluate submissions */
    const isJury = session !== null && (
        isCoordinator ||
        hasPermission('PermissionEvaluateSubmission')
    );

    /** Participant: can submit submissions */
    const isParticipant = session !== null && (
        isJury ||
        hasPermission('PermissionSubmitSubmission')
    );

    // ---- Legacy / project-scoped helpers ----

    const canAccessOtherProject = isAdmin;

    const canEditCampaignInProject = (campaignProjectId: string) => {
        if (!session) return false;
        if (isAdmin) return true;
        return session.projectId === campaignProjectId;
    };

    const canAccessProject = (projectId: string) => {
        if (!session) return false;
        if (canAccessOtherProject) return true;
        return session.projectId === projectId;
    };

    return {
        session,
        isAdmin,
        isProjectLead,
        isCoordinator,
        isJury,
        isParticipant,
        hasPermission,
        canAccessOtherProject,
        canEditCampaignInProject,
        canAccessProject,
    };
};

export default usePermissions;

