
import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import SessionProvider from './providers/SessionProvider'
import PrivateRoute from './components/auth/PrivateRoute'
import LoginPage from './pages/user/Login'
import Dashboard from './pages/home/Home'
import CallbackPage from './pages/user/Callback'
import CallbackWritePage from './pages/user/Callback/write'
import { ThemeProvider, CssBaseline } from '@mui/material'
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import theme from './theme'
import GlobalLoadingPage from './components/GlobalLoadingPage'
import ErrorBoundary from './components/ErrorBoundary'
import DirectionManager from './components/DirectionManager'

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
const RoundEvaluatePage = lazy(() => import('./pages/round/RoundEvaluate'))
const RoundEvaluatedPage = lazy(() => import('./pages/round/RoundEvaluated'))
const EvaluationEditPage = lazy(() => import('./pages/round/EvaluationEdit'))
const CallbackErrorPage = lazy(() => import('./pages/user/Callback/error'))
const ProfilePage = lazy(() => import('./pages/user/Profile'))
const NotFoundPage = lazy(() => import('./pages/error/NotFound'))

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <InitColorSchemeScript attribute="class" />
      <BrowserRouter>
        <DirectionManager />
        <ErrorBoundary>
        <Suspense fallback={<GlobalLoadingPage />}>
          <Routes>
            <Route path="/user/login" element={<LoginPage />} />
            <Route path="/user/callback" element={<CallbackPage />} />
            <Route path="/user/callback/write" element={<CallbackWritePage />} />
            <Route path="/user/callback/error" element={<CallbackErrorPage />} />
            <Route path="/policy/privacy" element={<PrivacyPolicy />} />
            <Route path="/policy/terms" element={<TermsOfService />} />
            <Route path="/user/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
            <Route path="/campaign" element={<PrivateRoute><CampaignListPage /></PrivateRoute>} />
            <Route path="/campaign/:campaignId" element={<PrivateRoute><CampaignViewPage /></PrivateRoute>} />
            <Route path="/campaign/:campaignId/edit" element={<PrivateRoute requiredPermission="PermissionUpdateCampaignDetails"><CampaignEditPage /></PrivateRoute>} />
            <Route path="/campaign/:campaignId/categorizer" element={<PrivateRoute><CampaignCategorizerPage /></PrivateRoute>} />
            <Route path="/round/:roundId/submission/evaluate" element={<PrivateRoute requiredPermission="PermissionEvaluateSubmission"><RoundEvaluatePage /></PrivateRoute>} />
            <Route path="/round/:roundId/submission/evaluated" element={<PrivateRoute requiredPermission="PermissionSeeOwnEvaluationResult"><RoundEvaluatedPage /></PrivateRoute>} />
            <Route path="/round/:roundId/submission/evaluated/:evaluationId" element={<PrivateRoute requiredPermission="PermissionSeeOwnEvaluationResult"><EvaluationEditPage /></PrivateRoute>} />
            <Route path="/project" element={<PrivateRoute><ProjectListPage /></PrivateRoute>} />
            <Route path="/project/new" element={<PrivateRoute requiredPermission="PermissionCreateProject"><ProjectCreatePage /></PrivateRoute>} />
            <Route path="/project/:projectId" element={<PrivateRoute><ProjectViewPage /></PrivateRoute>} />
            <Route path="/project/:projectId/edit" element={<PrivateRoute requiredPermission="PermissionUpdateProject"><ProjectEditPage /></PrivateRoute>} />
            <Route path="/project/:projectId/new" element={<PrivateRoute requiredPermission="PermissionCreateCampaign"><CampaignCreatePage /></PrivateRoute>} />
            <Route path="/" element={<SessionProvider requireAuth={false}><Dashboard /></SessionProvider>} />
            <Route path="/*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
        </ErrorBoundary>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
