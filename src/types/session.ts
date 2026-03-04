export interface User {
    id: string;
    registeredAt: string;
    username: string;
    permission: number;
    projectId: string | null;
}

export type PermissionName = (
    // User-level
    | 'PermissionLogin'
    | 'PermissionSeeAllUsers'
    | 'PermissionSeeUserDetails'
    // Project-level (admin/lead)
    | 'PermissionCreateProject'
    | 'PermissionUpdateProject'
    | 'PermissionDeleteProject'
    | 'PermissionOtherProjectAccess'
    // Campaign-level
    | 'PermissionCreateCampaign'
    | 'PermissionUpdateCampaignDetails'
    | 'PermissionUpdateCampaignStatus'
    | 'PermissionDeleteCampaign'
    | 'PermissionApproveRejectCampaign'
    // Round-level
    | 'PermissionCreateRound'
    | 'PermissionUpdateRoundDetails'
    | 'PermissionUpdateRoundStatus'
    | 'PermissionDeleteRound'
    // Evaluation / submission
    | 'PermissionSeeOwnEvaluationResult'
    | 'PermissionSeeOthersEvaluationResult'
    | 'PermissionEvaluateSubmission'
    | 'PermissionSubmitSubmission'
    | 'PermissionRandomize'
    // Legacy names kept for backward-compat
    | 'PermissionCreateUser'
    | 'PermissionDeleteUser'
    | 'PermissionEditCampaign'
    | 'PermissionEditUser'
    | 'PermissionViewCampaign'
    | 'PermissionViewUser'
)

type PermissionNumericValue = number

export type PermissionMap = {
    [key in PermissionName]?: PermissionNumericValue;
};

export interface Session extends User {
    permissions: PermissionName[];
    permissionMap: PermissionMap;
}

export interface SessionContextType {
    session: Session | null;
    setSession: (session: Session | null) => void;
    isExpired: boolean;
    setIsExpired: (expired: boolean) => void;
}
