import type { RoleWithUsername } from "@/types/role";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { useState } from "react";
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import CloseIcon from "@mui/icons-material/Close";
import TrophyIcon from "@mui/icons-material/EmojiEvents";

const Trophy = [
    <TrophyIcon key={0} sx={{ color: "gold" }} />,
    <TrophyIcon key={1} sx={{ color: "silver" }} />,
    <TrophyIcon key={2} sx={{ color: "#cd7f32" }} />,
]

const LeaderBoardButton = ({ juryList }: { juryList: RoleWithUsername[] }) => {
    const [showLeaderBoard, setShowLeaderBoard] = useState(false);
    return <>
        <Button
            variant="outlined"
            color="primary"
            startIcon={<LeaderboardIcon />}
            disabled={juryList.length === 0 || showLeaderBoard}
            onClick={() => setShowLeaderBoard(true)}
            sx={{ borderRadius: 3 }}
        >
            LeaderBoard
        </Button>
        {showLeaderBoard && (
            <Dialog open={showLeaderBoard} onClose={() => setShowLeaderBoard(false)} fullWidth maxWidth="lg">
                <DialogTitle>LeaderBoard</DialogTitle>
                <DialogContent>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Rank</TableCell>
                                <TableCell>Username</TableCell>
                                <TableCell>Total Evaluations</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {[...juryList].sort((a, b) => b.totalEvaluated - a.totalEvaluated).map((jury, index) => (
                                <TableRow key={jury.roleId}>
                                    <TableCell>
                                        {index + 1}
                                        {index < Trophy.length && Trophy[index]}
                                    </TableCell>
                                    <TableCell>{jury.username}</TableCell>
                                    <TableCell>{jury.totalEvaluated}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" color="error" onClick={() => setShowLeaderBoard(false)} startIcon={<CloseIcon />}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        )}
    </>
}

export default LeaderBoardButton
