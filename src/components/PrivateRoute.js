import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axiosInstance from '../axiosConfig'; // Axios instance'ınızı içe aktarın

const checkAuth = async () => {
    try {
        await axiosInstance.get('/auth/verify-token'); // Token doğrulama API çağrısı
        return true;
    } catch {
        return false;
    }
};

const PrivateRoute = ({ element }) => {
    const [isAuthenticated, setIsAuthenticated] = React.useState(null);
    const location = useLocation();

    React.useEffect(() => {
        const verifyToken = async () => {
            const isValid = await checkAuth();
            setIsAuthenticated(isValid);
        };
        verifyToken();
    }, []);

    if (isAuthenticated === null) {
        return <div>Loading...</div>; // veya bir loading spinner
    }

    return isAuthenticated ? (
        element
    ) : (
        <Navigate to="/" state={{ from: location }} replace />
    );
};

export default PrivateRoute;
