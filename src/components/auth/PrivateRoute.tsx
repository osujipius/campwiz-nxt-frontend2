import SessionProvider from "@/providers/SessionProvider";
import usePermissions from "@/hooks/usePermissions";
import type { PermissionName } from "@/types/session";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
    children: React.ReactNode;
    /** If specified, the user must have this permission or they are redirected to / */
    requiredPermission?: PermissionName;
}

/**
 * Inner component that runs *inside* SessionProvider so it can call usePermissions().
 * Separated out because hooks can only run inside a provider.
 */
const PrivateRouteGuard = ({ children, requiredPermission }: PrivateRouteProps) => {
    const { hasPermission } = usePermissions();

    if (requiredPermission && !hasPermission(requiredPermission)) {
        return <Navigate to="/?denied=1" replace />;
    }

    return <>{children}</>;
};

/**
 * Wraps a route so it requires authentication. Optionally enforces a specific
 * permission. If the user is unauthenticated they are redirected to /user/login.
 * If they are authenticated but lack the required permission they are redirected
 * to / with a `?denied=1` query param.
 *
 * Usage:
 *   <PrivateRoute>...</PrivateRoute>
 *   <PrivateRoute requiredPermission="PermissionCreateCampaign">...</PrivateRoute>
 */
const PrivateRoute = ({ children, requiredPermission }: PrivateRouteProps) => {
    return (
        <SessionProvider>
            <PrivateRouteGuard requiredPermission={requiredPermission}>
                {children}
            </PrivateRouteGuard>
        </SessionProvider>
    );
};

export default PrivateRoute;
