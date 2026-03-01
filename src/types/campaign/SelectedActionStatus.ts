const SelectedRoundActionStatus = {
    creating: 'creating',
    importing: 'importing',
    finalizing: 'finalizing',
    editing: 'editing',
    distributing: 'distributing',
    none: ''
} as const;

type SelectedRoundActionStatus = typeof SelectedRoundActionStatus[keyof typeof SelectedRoundActionStatus];

export default SelectedRoundActionStatus;
