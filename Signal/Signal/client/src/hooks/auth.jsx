import { useSelector, useDispatch } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import axios from 'axios';
import { Loader } from '@globals';
import { authenticate } from '@store/auth';
import { useEffect } from 'react';

export function useAuth() {
    const auth = useSelector((state) => state.auth);    
    return auth;
}

export default function useAuthenticate() {
    const dispatch = useDispatch();
    const auth = useAuth();
    
    const authentication = useQuery({
        queryKey: ['authenticate'],
        queryFn: async () => {
            const res = await axios.get("/auth/authenticate", { withCredentials: true });
            return res.data;
         },
        onError: (error) => {
            console.error("Authentication error:", error);
        },
        refetchOnWindowFocus: false,
        enabled: !auth.isAuthenticated
    });            
    
    useEffect(() => {
        if(authentication?.data?.isAuthenticated) {
            dispatch(authenticate(authentication.data));
        }    
    }, [authentication.data, dispatch]);

    return {
        isLoading: authentication.isLoading,
        error: authentication.error
    }
}

export function ProtectedLayout() {
    const { isLoading } = useAuthenticate();
    const auth = useAuth();
    const location = useLocation();

    if(isLoading) {
        return(<Loader />);
    }
    
    if (!auth.isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
        
    return <Outlet />;
}
