import React, { type ErrorInfo, type ReactNode } from 'react';
import { Paper, Typography, Button } from '@mui/material';

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <Paper
                    sx={{
                        padding: 4,
                        textAlign: 'center',
                        maxWidth: 600,
                        mx: 'auto',
                        my: 4,
                        borderRadius: 3,
                    }}
                >
                    <img src="/molumen-red-square-error-warning-icon.svg" alt="Error" width={80} height={80} style={{ margin: '0 auto 16px' }} />
                    <Typography variant="h4" sx={{ mb: 2 }}>Something went wrong</Typography>
                    <Typography variant="body1" sx={{ mb: 3 }} color="text.secondary">
                        {this.state.error?.message || 'An unexpected error occurred while trying to load this page.'}
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            this.setState({ hasError: false, error: null });
                            window.location.reload();
                        }}
                        sx={{ borderRadius: 7 }}
                    >
                        Try Again
                    </Button>
                </Paper>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
