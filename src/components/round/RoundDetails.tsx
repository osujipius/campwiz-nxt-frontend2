import { EvaluationType, type Round } from "@/types/round";
import type { RoleWithUsername } from "@/types/role";
import Box from "@mui/material/Box";
import Deadline from "./Deadline";
import Description from "./Description";
import Quorum from "./Quorum";
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import JuryList from "./Jury";
import { useMemo } from "react";
import LikeDislike from "@mui/icons-material/ThumbUpOffAlt";
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import StarsIcon from '@mui/icons-material/Stars';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import RoundSummary from "./RoundSummary";
import type { TFunction } from "i18next";

const roundTypeIcon = (type: EvaluationType, t: TFunction) => {
    switch (type) {
        case EvaluationType.BINARY:
            return <Description description={t('round.type.binary')} label={t('round.type.label')} Icon={LikeDislike} />
        case EvaluationType.RANKING:
            return <Description description={t('round.type.ranking')} label={t('round.type.label')} Icon={MilitaryTechIcon} />
        case EvaluationType.SCORE:
            return <Description description={t('round.type.score')} label={t('round.type.label')} Icon={StarsIcon} />
        default:
            return <Description description={t('round.type.unknown')} label={t('round.type.label')} Icon={QuestionMarkIcon} />
    }
}

const RoundDetails = ({ round: c, t }: { round: Round; t: TFunction }) => {
    const [juryList] = useMemo(() => {
        if (!c.jury || !c.roles) return [[] as RoleWithUsername[]]
        const id2UsernameMap = c.jury;
        const juryList: RoleWithUsername[] = [];
        for (const role of c.roles) {
            const username = id2UsernameMap[role.userId];
            if (username) {
                juryList.push({ ...role, username });
            }
        }
        return [juryList]
    }, [c])

    return (
        <Box sx={{
            textAlign: 'left', mx: 'auto', display: 'inline-block',
            minWidth: 300, width: '100%', p: 2,
            border: 1, borderColor: 'primary.main', borderRadius: 6,
        }}>
            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row-reverse' },
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <RoundSummary c={c} />
                <div>
                    <Deadline deadline={c.endDate} t={t} />
                    {roundTypeIcon(c.type, t)}
                    <Description description={c.description} label={t('round.description')} />
                    <Description description={t('round.evaluatedOutOf', {
                        total: c.totalSubmissions,
                        evaluated: c.totalEvaluatedSubmissions,
                    })} label={t('round.submissions')} Icon={HistoryEduIcon} />
                    {!c.isPublicJury && <Description description={t('round.evaluatedOutOf', {
                        total: c.totalAssignments,
                        evaluated: c.totalEvaluatedAssignments
                    })} label={t('round.assignments')} Icon={HistoryEduIcon} />}
                    <Quorum quorum={c.quorum} t={t} />
                </div>
            </Box>
            <JuryList juryList={juryList} isPublicJury={c.isPublicJury} t={t} />
        </Box>
    )
}

export default RoundDetails
