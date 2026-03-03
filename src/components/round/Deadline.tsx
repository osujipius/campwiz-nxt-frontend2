import Typography from '@mui/material/Typography'
import { useMemo } from "react"
import DateRangeIcon from '@mui/icons-material/DateRange'
import type { TFunction } from 'i18next'

const MS_SECOND = 1000
const MS_MINUTE = MS_SECOND * 60
const MS_HOUR = MS_MINUTE * 60
const MS_DAY = MS_HOUR * 24
const MS_WEEK = MS_DAY * 7
const MS_MONTH = MS_DAY * 30

const Deadline = ({ deadline, t }: { deadline: string; t: TFunction }) => {
    const [d, time] = useMemo(() => {
        const d = new Date(deadline)
        const diff = d.getTime() - Date.now()
        if (diff < 0) return [d, t('round.deadLinePassed')]
        const months = Math.floor(diff / MS_MONTH)
        if (months > 0) return [d, t('round.deadLineInMonths', { count: months })]
        const weeks = Math.floor(diff / MS_WEEK)
        if (weeks > 0) return [d, t('round.deadLineInWeeks', { count: weeks })]
        const days = Math.floor(diff / MS_DAY)
        if (days > 0) return [d, t('round.deadLineInDays', { count: days })]
        const hours = Math.floor(diff / MS_HOUR)
        if (hours > 0) return [d, t('round.deadLineInHours', { count: hours })]
        const minutes = Math.floor(diff / MS_MINUTE)
        if (minutes > 0) return [d, t('round.deadLineInMinutes', { count: minutes })]
        const seconds = Math.floor(diff / MS_SECOND)
        return [d, t('round.deadLineInSeconds', { count: seconds })]
    }, [deadline, t])

    return (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'left' }}>
            <DateRangeIcon sx={{ display: 'inline-block', mr: 1 }} fontSize="large" />
            <div style={{ display: 'inline-block' }}>
                <Typography variant="h6" sx={{ mb: 0 }} component='div'>
                    {t('round.deadline')}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2, mt: -0.5 }} component='div'>
                    {d.toDateString()} <Typography variant="body1" color="textSecondary" sx={{ display: 'inline' }}>({time})</Typography>
                </Typography>
            </div>
        </div>
    )
}

export default Deadline
