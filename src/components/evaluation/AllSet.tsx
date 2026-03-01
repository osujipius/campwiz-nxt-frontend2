import { Button } from '@mui/material'
import { Link } from 'react-router-dom'
import EditIcon from '@mui/icons-material/Edit'
import ArrowBackward from '@mui/icons-material/ArrowBack'
import ShowSkippedButton from './ShowSkippedButton'

const AllSet = ({ campaignId, roundId, skipCount }: { roundId: string; campaignId: string; skipCount: number }) => {
    return (
        <div className="flex flex-col items-center justify-center h-full w-full">
            <Link to="/" className="cursor-pointer">
                <img src="/logo.svg" alt="Logo of CampWiz" height={80} style={{ margin: 'auto' }} />
            </Link>
            <div className="text-center">
                <h1 className="text-2xl font-bold">All Set</h1>
                <p className="text-lg">
                    Seems like, You have no pending submissions to evaluate in this round.
                </p>
                <div className="flex-row flex justify-center">
                    <Link to={`/campaign/${campaignId}`}>
                        <Button variant="contained" color="primary" sx={{ m: 1 }} startIcon={<ArrowBackward />}>
                            Go to Round
                        </Button>
                    </Link>
                    <Link to={`/round/${roundId}/submission/evaluated`}>
                        <Button variant="outlined" color="secondary" sx={{ m: 1 }} endIcon={<EditIcon />}>
                            Modify your votes
                        </Button>
                    </Link>
                    {skipCount > 0 && (
                        <ShowSkippedButton skipCount={skipCount} roundId={roundId} campaignId={campaignId} />
                    )}
                </div>
            </div>
        </div>
    )
}

export default AllSet
