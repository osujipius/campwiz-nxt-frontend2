import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useSWR from "swr";
import { fetchAPIFromBackendSingleWithErrorHandling } from "@/api";
import { getUncategorizedSubmissions, updateSubmissionCategories } from "@/api/round";
import type { Campaign } from "@/types/campaign";
import type { Category, Submission, SubmissionWithCategories } from "@/types/submission";
import { Autocomplete, Button, Chip, LinearProgress, Link as MuiLink, TextField, Typography } from "@mui/material";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import { useState } from "react";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackwardIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import type { TFunction } from "i18next";

const getSummary = (t: TFunction, categories: Category[]) => {
    if (categories.length === 0) return t('submission.noCategoriesSelected');
    let summary = 'Added via [[Commons:CampWiz|CampWiz]] categorizer:\n';
    for (const category of categories) {
        if (!category.fixed) summary += `+ ${category.name}\n`;
    }
    return summary;
}

const getHeightWidth = (currentHeight: number, currentWidth: number, maxHeight: number, maxWidth: number) => {
    if (currentHeight > maxHeight || currentWidth > maxWidth) {
        const ratio = Math.max(currentHeight / maxHeight, currentWidth / maxWidth);
        currentHeight = currentHeight / ratio;
        currentWidth = currentWidth / ratio;
    }
    currentHeight = Math.min(Math.max(currentHeight, 100), maxHeight);
    currentWidth = Math.min(Math.max(currentWidth, 100), maxWidth);
    return [Math.round(currentHeight * 100) / 100, Math.round(currentWidth * 100) / 100];
}

type SingleSubmissionProps = {
    submission: Submission; cursor: number; setCursor: (cursor: number) => void; totalSubmissions: number; t: TFunction
}

const SingleSubmission = ({ submission: initialSubmission, cursor, setCursor, totalSubmissions, t }: SingleSubmissionProps) => {
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [submission, setSubmission] = useState<SubmissionWithCategories | Submission>(initialSubmission);

    const handleSubmit = async (submissionId: string, cats: string[], summary: string) => {
        setLoading(true);
        try {
            const response = await updateSubmissionCategories(submissionId, cats, summary);
            if (!response || 'detail' in response) return;
            if (cursor >= totalSubmissions - 1) window.location.reload();
            else setCursor(Math.min(cursor + 1, totalSubmissions - 1));
        } catch (e) { console.error(e) }
        finally { setLoading(false) }
    }

    const { isLoading, error } = useSWR(`/category/${initialSubmission.submissionId}`, fetchAPIFromBackendSingleWithErrorHandling<SubmissionWithCategories>, {
        onSuccess: (data) => {
            if (data && 'data' in data && data.data) {
                setCategories(data.data.categories || []);
                setSubmission(data.data);
            }
        },
        revalidateOnFocus: false, revalidateOnReconnect: false, keepPreviousData: true,
    });

    if (isLoading) return <LinearProgress className="w-full" />;
    if (error) return <p>{t('error.loadingSubmissionDetails', { error: error.message })}</p>;
    if (!('categories' in submission)) return <p>{t('error.categoriesNotLoaded')}</p>;

    const fixedCategories = categories.filter(c => c.fixed);
    const [thumbheight, thumbwidth] = getHeightWidth(submission.thumbheight, submission.thumbwidth, 500, Math.min(window.innerWidth, 500));

    return (
        <div className="text-center w-full flex flex-col justify-around items-center flex-wrap">
            {loading && <LinearProgress className="w-full" />}
            <p className="mb-3 p-2 block">
                <b className="font-bold">{t('submission.title')}: </b>
                <MuiLink href={`https://commons.wikimedia.org/wiki/File:${submission.title}`} className="text-blue-500 hover:underline" target="_blank" title={t('submission.viewOnCommons')}>
                    {submission.title.replaceAll("_", " ")} ⇱
                </MuiLink>
            </p>
            <div className="flex flex-col md:flex-row gap-4">
                <img src={submission.thumburl} alt={submission.title} style={{ maxWidth: '100%', height: 'auto' }} width={thumbwidth} height={thumbheight} />
                <div className="max-full md:max-w-96 flex flex-col justify-between items-start">
                    <p className="mb-3 p-2"><b className="font-bold">{t('submission.description')}: </b> {initialSubmission.description}</p>
                    <div>
                        <Autocomplete multiple id="campwiz-categories" value={categories} size="small" options={submission.categories}
                            getOptionLabel={(option) => option.name}
                            onChange={(_event, newValue) => {
                                const nonFixed = newValue.filter(c => !c.fixed);
                                const unique = Array.from(new Set(nonFixed.map(c => c.name))).map(name => nonFixed.find(c => c.name === name) || { name, fixed: false });
                                setCategories([...fixedCategories, ...unique].sort((a, b) => a.name.localeCompare(b.name)));
                            }}
                            renderTags={(value, getTagProps) => value.map((option, index) => (
                                <Chip label={option.name} {...getTagProps({ index })} disabled={option.fixed} key={index} size="small" />
                            ))}
                            className="max-w-fit"
                            renderInput={(params) => <TextField {...params} label={t('submission.categories')} placeholder={t('submission.selectCategories')} variant="outlined" />}
                        />
                        <div className="flex flex-row justify-between items-center p-2">
                            <Button onClick={() => setCursor(Math.max(cursor - 1, 0))} loading={loading} startIcon={<ArrowBackwardIcon />} disabled={cursor === 0 || loading} variant="contained" color="primary">{t('submission.previous')}</Button>
                            <Button disabled={cursor >= totalSubmissions - 1 || loading} loading={loading} startIcon={<ArrowForwardIcon />} onClick={() => setCursor(Math.min(cursor + 1, totalSubmissions - 1))} variant="contained" color="primary">{t('submission.skip')}</Button>
                            <Button variant="contained" color="success" onClick={() => handleSubmit(submission.submissionId, categories.map(c => c.name), getSummary(t, categories))} sx={{ m: 1 }} disabled={loading} loading={loading} startIcon={<SaveIcon />}>{t('submission.save')}</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const CampaignCategorizerPage = () => {
    const { campaignId } = useParams<{ campaignId: string }>();
    const { t } = useTranslation();
    const [cursor, setCursor] = useState(0);

    const { data: campaignResponse, isLoading: campaignLoading } = useSWR(
        campaignId ? `/campaign/${campaignId}/?includeRoles=true&includeRounds=true` : null,
        fetchAPIFromBackendSingleWithErrorHandling<Campaign>
    );

    const { data: submissionsResult, isLoading: submissionsLoading } = useSWR(
        campaignId ? ['uncategorized', campaignId] : null,
        () => getUncategorizedSubmissions(campaignId!)
    );

    if (campaignLoading || submissionsLoading) return <><Header returnTo={`/campaign/${campaignId}`} /><LinearProgress /></>;

    if (!campaignResponse || 'detail' in campaignResponse) return <><Header returnTo={`/campaign/${campaignId}`} /><Typography sx={{ m: 2 }}>{campaignResponse && 'detail' in campaignResponse ? campaignResponse.detail : 'Error'}</Typography></>;
    if (!submissionsResult || 'detail' in submissionsResult) return <><Header returnTo={`/campaign/${campaignId}`} /><Typography sx={{ m: 2 }}>{submissionsResult && 'detail' in submissionsResult ? submissionsResult.detail : 'Error fetching submissions'}</Typography></>;

    const submissions = submissionsResult.data;
    if (!submissions || submissions.length === 0) return <><Header returnTo={`/campaign/${campaignId}`} /><Typography sx={{ m: 2 }}>{t('error.noSubmissionAvailableForCategorization')}</Typography></>;

    const currentSubmission = submissions[cursor] ?? null;
    if (!currentSubmission) return <><Header returnTo={`/campaign/${campaignId}`} /><Typography sx={{ m: 2 }}>{t('error.noSubmissions')}</Typography></>;

    return (
        <div>
            <Header returnTo={`/campaign/${campaignResponse.data.campaignId}`} />
            <div className="text-center">
                <SingleSubmission submission={currentSubmission} cursor={cursor} setCursor={setCursor} totalSubmissions={submissions.length} t={t} />
            </div>
            <Footer />
        </div>
    );
}

export default CampaignCategorizerPage
