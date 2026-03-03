import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"
import { useState } from "react"
import ImportFromCommonsWidget from "./ImportFromCommonsWidget"
import type { ImportDialogProps } from "./ImportDialogProps"

const ImportFromCommonsDialog = ({ round, onClose, distribute }: ImportDialogProps) => {
    const [importing, setImporting] = useState(false)
    return (
        <Dialog open={true} onClose={onClose}>
            <DialogTitle>Import from Commons</DialogTitle>
            <DialogContent>
                <ImportFromCommonsWidget roundId={round.roundId} importing={importing} setImporting={setImporting} afterImport={distribute} />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="outlined" color="error" disabled={importing} loading={importing}>
                    Close Dialog
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ImportFromCommonsDialog
