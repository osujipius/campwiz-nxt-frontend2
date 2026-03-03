export const RoleType = {
    Coordinator: "coordinator",
    Jury: "jury",
} as const;

export type RoleType = typeof RoleType[keyof typeof RoleType];

export interface Role {
    roleId: string
    type: RoleType
    userId: string
    projectId: string
    targetProjectId: string | null
    campaignId: string
    roundId: string
    isAllowed: boolean
    totalAssigned: number
    totalEvaluated: number
    totalScore: number
    permission: number
}

export type RoleWithUsername = Role & { username: string }
