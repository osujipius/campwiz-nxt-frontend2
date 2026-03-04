import { useCallback, useEffect, useRef, useState } from "react";
import type { Session } from "../types/session";
import sessionContext from "../contexts/SessionContext";
import { Navigate, useNavigate } from "react-router-dom";
import { fetchAPIFromBackendSingleWithErrorHandling } from "@/api";
import { Alert, Box, Button, CircularProgress, Typography } from "@mui/material";

const SessionLoading = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: 2 }}>
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">Loading session…</Typography>
    </Box>
);

const SessionErrorUI = ({ error, onRetry }: { error: Error; onRetry: () => void }) => {
    const navigate = useNavigate();
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', p: 3 }}>
            <Box sx={{ maxWidth: 480, width: '100%' }}>
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    action={
                        <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
                            <Button size="small" color="inherit" onClick={onRetry}>Try Again</Button>
                            <Button size="small" color="inherit" onClick={() => navigate('/user/login')}>Go to Login</Button>
                        </Box>
                    }
                >
                    <Typography variant="body2">{error.message}</Typography>
                </Alert>
            </Box>
        </Box>
    );
};

const SessionProvider = ({ children, requireAuth = true }: { children: React.ReactNode, requireAuth?: boolean }) => {
    const [sessionLoading, setSessionLoading] = useState(true);
    const [session, setSession] = useState<Session | null>(null);
    const [sessionError, setSessionError] = useState<Error | null>(null);
    const [isExpired, setIsExpired] = useState(false);
    // Use a ref to allow the event listener to call the latest fetchSession
    const fetchSessionRef = useRef<() => void>(() => {});

    const fetchSession = useCallback(async () => {
        setSessionLoading(true);
        setSessionError(null);
        try {
            const response = await fetchAPIFromBackendSingleWithErrorHandling<Session>('/user/me');
            if ('detail' in response) {
                throw new Error(response.detail);
            }
            setSession(response.data);
            setIsExpired(false);
        } catch (error) {
            setSession(null);
            console.error("Failed to fetch session:", error);
            setSessionError(error as Error);
        } finally {
            setSessionLoading(false);
        }
    }, []);

    fetchSessionRef.current = fetchSession;

    useEffect(() => {
        fetchSession();
    }, [fetchSession]);

    // Listen for 401 signals dispatched by the API layer
    useEffect(() => {
        const handleExpired = () => {
            setSession(null);
            setIsExpired(true);
        };
        window.addEventListener('campwiz:session-expired', handleExpired);
        return () => window.removeEventListener('campwiz:session-expired', handleExpired);
    }, []);

    // Redirect to login when session is expired
    if (isExpired && !sessionLoading && requireAuth) {
        let path = encodeURIComponent(window.location.pathname + window.location.search);
        if (window.location.pathname.startsWith('/user/login')) path = '/';
        return <Navigate to={`/user/login?next=${path}&reason=expired`} replace />;
    }

    // Redirect to login when unauthenticated
    if (!session && !sessionLoading && requireAuth && !sessionError) {
        let path = encodeURIComponent(window.location.pathname + window.location.search);
        if (window.location.pathname.startsWith('/user/login')) path = '/';
        return <Navigate to={`/user/login?next=${path}`} replace />;
    }

    if (sessionLoading && requireAuth) return <SessionLoading />;
    if (sessionError && requireAuth) return <SessionErrorUI error={sessionError} onRetry={fetchSession} />;

    return (
        <sessionContext.Provider value={{ session, setSession, isExpired, setIsExpired }}>
            {children}
        </sessionContext.Provider>
    );
};

export default SessionProvider;