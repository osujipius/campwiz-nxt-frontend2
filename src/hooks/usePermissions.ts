import useSession from "@/hooks/useSession";

/**
 * Hook to check user permissions. Mirrors the source project's permission system.
 */
const usePermissions = () => {
    const session = useSession();

    const canAccessOtherProject = session
        ? (session.permission & session.permissionMap.PermissionOtherProjectAccess) === session.permissionMap.PermissionOtherProjectAccess
        : false;

    const isAdmin = canAccessOtherProject;

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
        canAccessOtherProject,
        canEditCampaignInProject,
        canAccessProject,
    };
};

export default usePermissions;
