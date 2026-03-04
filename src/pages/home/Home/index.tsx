import { Suspense, lazy, useEffect, useState } from 'react';
import PublicRunningCampaigns from '@/components/campaign/PublicCampaigns';
import HeroBanner from '@/components/home/HeroBanner';
import { Alert, LinearProgress, Snackbar, Typography } from '@mui/material';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import useSession from '@/hooks/useSession';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

const AssignedCampaigns = lazy(() => import('@/components/campaign/AssignCampaigns'));

const Dashboard = () => {
  const { session } = useSession();
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [deniedOpen, setDeniedOpen] = useState(false);

  // Show snackbar when redirected here due to permission denial
  useEffect(() => {
    if (searchParams.get('denied') === '1') {
      setDeniedOpen(true);
      // Remove the query param from the URL to avoid showing again on refresh
      searchParams.delete('denied');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);
  
  return (
    <>
      <Header />
      <Snackbar
        open={deniedOpen}
        autoHideDuration={6000}
        onClose={() => setDeniedOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setDeniedOpen(false)} sx={{ width: '100%' }}>
          {t('error.accessDenied', 'You do not have permission to access that page.')}
        </Alert>
      </Snackbar>
      <HeroBanner session={session} />
      {session && (
        <Suspense fallback={<LinearProgress sx={{ m: 2 }} />}>
          <AssignedCampaigns limit={5} />
        </Suspense>
      )}

      <div className="" style={{}}>
        <Typography variant="h4" sx={{
          textAlign: 'center', m: 3,
           // backgroundImage: 'linear-gradient(to right, red 20%,  blue 80%)',
          backgroundClip: 'text'
        }} color='error'>
          {t('home.publicRunningCampaigns')}
        </Typography>
        <PublicRunningCampaigns limit={10} />
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
