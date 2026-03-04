export const RoleType = {
    Admin: "admin",
    ProjectLead: "projectLead",
    Coordinator: "coordinator",
    Jury: "jury",
    Participant: "participant",
} as const;

export type RoleType = typeof RoleType[keyof typeof RoleType];

export interface Role {
    roleId: string
    type: RoleType
    userId: string
    projectId: string
    targetProjectId: string | null
    campaignId: string | null
    roundId: string | null
    totalAssigned: number
    totalEvaluated: number
    totalScore: number
    permission: number
}

export type RoleWithUsername = Role & { username: string }
