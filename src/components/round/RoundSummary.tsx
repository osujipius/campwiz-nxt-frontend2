import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { fetchRoundResults } from "@/api/round";
import useSWR from "swr";
import CloseIcon from '@mui/icons-material/Close';
import CircularProgressWithLabel from "./CircularProgressWithLabel";
import { useState } from "react";
import type { Round, SubmissionResultSummary } from "@/types/round";
import SummaryIcon from '@mui/icons-material/Assessment';

const RoundSummaryDialog = ({ round: c, onClose }: { round: Round; onClose: () => void }) => {
    const { data: summaryResponse, isLoading, error } = useSWR(`/round/${c.roundId}/results/summary`, fetchRoundResults, {
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        revalidateOnMount: true,
    });

    return (
        <Dialog open onClose={onClose} fullWidth>
            <DialogTitle>Round Summary</DialogTitle>
            <DialogContent>
                {isLoading && <CircularProgress size={24} />}
                {error && <p className="text-red-500">Error: {error.message}</p>}
                {summaryResponse && !isLoading && !error && (
                    ('detail' in summaryResponse) ? <p className="text-red-500">Error: {summaryResponse.detail}</p> :
                        <Table>
                            <caption>
                                * If two zeros appear in the Average Score column, the last zero means Unevaluated Submissions
                            </caption>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Average Score *</TableCell>
                                    <TableCell>Submission Count</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(summaryResponse.data as (SubmissionResultSummary & { cumulative: number })[]).map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{row.averageScore}</TableCell>
                                        <TableCell>{row.submissionCount}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="outlined" color="error" disabled={isLoading} startIcon={<CloseIcon />}>
                    Close Dialog
                </Button>
            </DialogActions>
        </Dialog>
    )
}

const RoundSummary = ({ c }: { c: Round }) => {
    const [showSummaryOpen, setShowSummaryOpen] = useState(false);
    const { totalSubmissions, totalEvaluatedSubmissions } = c;
    const progress = totalSubmissions > 0 ? Math.floor(totalEvaluatedSubmissions / totalSubmissions * 100) : 0;
    return (
        <div className="round-progress flex flex-col items-center">
            <CircularProgressWithLabel value={progress} size='10em' color='success' /><br />
            <Button
                variant="contained"
                onClick={() => setShowSummaryOpen(true)}
                color="success" size="large"
                sx={{ borderRadius: 2, px: 2, my: 'auto' }}
                startIcon={<SummaryIcon />}
            >
                Summary
            </Button>
            {showSummaryOpen && <RoundSummaryDialog round={c} onClose={() => setShowSummaryOpen(false)} />}
        </div>
    )
}

export default RoundSummary
