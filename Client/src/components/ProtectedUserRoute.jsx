import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AppContext } from "../Context/Appcontext";

const ProtectedUserRoute = () => {
    const { isLoggedin, loading } = useContext(AppContext);

    // Show loading while checking auth
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center dark:bg-gray-900 bg-gray-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    // Redirect to login if not logged in
    if (!isLoggedin) {
        return <Navigate to="/login" replace />;
    }

    // Render protected routes
    return <Outlet />;
};

export default ProtectedUserRoute;
