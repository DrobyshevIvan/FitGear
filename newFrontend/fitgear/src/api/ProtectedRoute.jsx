import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole }) => {
    const { user, loading, hasRole } = useAuth();

    if (loading) {
        return (
            <>
                <div>Завантаження</div>
            </>
        );
    }

    if (!user || (requiredRole && !hasRole(requiredRole))) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;