import LottieWrapper from "@/components/LottieWrapper";
import { Button, Paper } from "@mui/material";
import { Link, useSearchParams } from "react-router-dom";

const LoginError = () => {
    const [searchParams] = useSearchParams();
    const error = searchParams.get('error') || 'Unknown error';
    const state = searchParams.get('state') || '/';

    return (
        <Paper sx={{ padding: 2 }}>
            <LottieWrapper src='/lottie/login-failed.lottie' />
            <h1 className="text-red-500 font-bold">Sorry there was an error logging you in!</h1>
            <p className="text-red-500 font-bold">{error}</p>
            <Link to={"/user/login?next=" + state}>
                <Button
                    variant="contained"
                    color="error"
                >
                    Try Again
                </Button>
            </Link>
        </Paper>
    );
};

export default LoginError;
