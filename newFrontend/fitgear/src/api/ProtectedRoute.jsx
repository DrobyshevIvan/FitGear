import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole }) => {
    const { user, loading, hasRole } = useAuth();

    if (loading) {
        return <div>Завантаження...</div>;
    }

    const checkRole = () => {
        if (!requiredRole) return true;
        if (Array.isArray(requiredRole)) {
            return requiredRole.some(role => hasRole(role));
        }
        return hasRole(requiredRole);
    };

    if (!user || !checkRole()) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
