import { Suspense, useState } from "react"
import { startImportFromRound, fetchRoundResults } from "@/api/round"
import ImportStatusThingy from "./ImportStatusThingy"
import LottieWrapper from "@/components/LottieWrapper"
import type { Round, SubmissionResultSummary } from "@/types/round"
import useSWR from "swr"
import { Autocomplete, Button, Checkbox, LinearProgress, TextField } from "@mui/material"
import type { Task } from "@/types/task"
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

function ScoreInputs({ resultSummary: availableScores, scores, setScores }: {
    resultSummary: SubmissionResultSummary[]
    scores: Set<string>
    setScores: (scores: Set<string>) => void
}) {
    const availableScoresWithTitles = [...availableScores].sort((a, b) => a.averageScore - b.averageScore).map(score => ({
        title: `${score.averageScore}% (${score.submissionCount} files)`,
        value: score.averageScore.toString(),
    }));
    return (
        <Autocomplete
            multiple disableCloseOnSelect
            options={availableScoresWithTitles}
            value={Array.from(scores).map(s => availableScoresWithTitles.find(o => o.value === s) || { title: s, value: s })}
            onChange={(_event, newValue) => setScores(new Set(newValue.map(v => v.value)))}
            isOptionEqualToValue={(option, value) => option.value === value.value}
            getOptionLabel={(option) => option.value}
            renderOption={(props, option, { selected }) => {
                const { key, ...optionProps } = props;
                return (<li key={key} {...optionProps}><Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />{option.title}</li>);
            }}
            sx={{ m: 1 }} fullWidth
            renderInput={(params) => <TextField {...params} label="Select Scores to Import" placeholder="Select scores to import" fullWidth />}
        />
    );
}

type ImportFromRoundWidgetProps = {
    currentRound: Round
    importing: boolean
    setImporting: (loading: boolean) => void
    distribute: (t: Task) => void
}

const ImportFromRoundWidget = ({ currentRound, importing, setImporting, distribute: afterImport }: ImportFromRoundWidgetProps) => {
    const [taskID, setTaskID] = useState('')
    const [scores, setScores] = useState<Set<string>>(new Set<string>())
    const { data: summaryResponse, isLoading } = useSWR(
        `/round/${currentRound.dependsOnRoundId}/results/summary`,
        fetchRoundResults,
        { revalidateOnFocus: true, revalidateOnReconnect: true, revalidateOnMount: true }
    )

    const startImporting = async (selectedScores: string[], fromId?: string) => {
        try {
            if (!fromId) throw new Error('No round to import from')
            setImporting(true)
            const taskResponse = await startImportFromRound(currentRound.roundId, fromId, selectedScores)
            if ('detail' in taskResponse) throw new Error(taskResponse.detail)
            setTaskID(taskResponse.data.taskId)
        } catch (e) {
            console.error(e)
        } finally {
            setImporting(false)
        }
    }

    if (isLoading) return <LinearProgress />
    if (!summaryResponse) return <div>Failed to load summary</div>
    if ('detail' in summaryResponse) return <div>{summaryResponse.detail}</div>

    const summaryScore = summaryResponse.data as SubmissionResultSummary[];
    return taskID
        ? <ImportStatusThingy taskId={taskID} onSuccess={afterImport} />
        : (
            <Suspense fallback={<LottieWrapper src="/lottie/importing.lottie" />}>
                <div className="flex flex-col gap-4">
                    {summaryScore.length === 0
                        ? <div>No submissions to import</div>
                        : <ScoreInputs resultSummary={summaryScore} scores={scores} setScores={setScores} />}
                    <Button onClick={() => startImporting(Array.from(scores), currentRound.dependsOnRoundId)}
                        disabled={importing || scores.size === 0} loading={importing}
                        variant="contained" color="primary">
                        Import
                    </Button>
                </div>
            </Suspense>
        )
}

export default ImportFromRoundWidget
