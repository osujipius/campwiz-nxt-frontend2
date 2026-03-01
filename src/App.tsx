
import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import SessionProvider from './providers/SessionProvider'
import LoginPage from './pages/user/Login'
import Dashboard from './pages/home/Home'
import CallbackPage from './pages/user/Callback'
import CallbackWritePage from './pages/user/Callback/write'
import { ThemeProvider, CssBaseline } from '@mui/material'
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import theme from './theme'
import GlobalLoadingPage from './components/GlobalLoadingPage'

const PrivacyPolicy = lazy(() => import('./pages/policy/Privacy'))
const TermsOfService = lazy(() => import('./pages/policy/Terms'))
const CampaignListPage = lazy(() => import('./pages/campaign/CampaignList'))
const CampaignViewPage = lazy(() => import('./pages/campaign/CampaignView'))
const CampaignEditPage = lazy(() => import('./pages/campaign/CampaignEdit'))
const CampaignCategorizerPage = lazy(() => import('./pages/campaign/CampaignCategorizer'))
const ProjectListPage = lazy(() => import('./pages/project/ProjectList'))
const ProjectViewPage = lazy(() => import('./pages/project/ProjectView'))
const ProjectCreatePage = lazy(() => import('./pages/project/ProjectCreate'))
const ProjectEditPage = lazy(() => import('./pages/project/ProjectEdit'))
const CampaignCreatePage = lazy(() => import('./pages/project/CampaignCreate'))

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <InitColorSchemeScript attribute="class" />
      <BrowserRouter>
        <Suspense fallback={<GlobalLoadingPage />}>
          <Routes>
            <Route path="/user/login" element={<LoginPage />} />
            <Route path="/user/callback" element={<CallbackPage />} />
            <Route path="/user/callback/write" element={<CallbackWritePage />} />
            <Route path="/policy/privacy" element={<PrivacyPolicy />} />
            <Route path="/policy/terms" element={<TermsOfService />} />
            <Route path="/campaign" element={<PrivateRoute><CampaignListPage /></PrivateRoute>} />
            <Route path="/campaign/:campaignId" element={<PrivateRoute><CampaignViewPage /></PrivateRoute>} />
            <Route path="/campaign/:campaignId/edit" element={<PrivateRoute><CampaignEditPage /></PrivateRoute>} />
            <Route path="/campaign/:campaignId/categorizer" element={<PrivateRoute><CampaignCategorizerPage /></PrivateRoute>} />
            <Route path="/project" element={<PrivateRoute><ProjectListPage /></PrivateRoute>} />
            <Route path="/project/new" element={<PrivateRoute><ProjectCreatePage /></PrivateRoute>} />
            <Route path="/project/:projectId" element={<PrivateRoute><ProjectViewPage /></PrivateRoute>} />
            <Route path="/project/:projectId/edit" element={<PrivateRoute><ProjectEditPage /></PrivateRoute>} />
            <Route path="/project/:projectId/new" element={<PrivateRoute><CampaignCreatePage /></PrivateRoute>} />
            <Route path="/" element={<SessionProvider requireAuth={false}><Dashboard /></SessionProvider>} />
            <Route path="/*" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
