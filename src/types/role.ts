export enum RoleType {
    Coordinator = "coordinator",
    Jury = "jury",
}

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
