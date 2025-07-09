import { useState, useEffect, useMemo } from "react";
import { createBrowserRouter, useLocation, Navigate, Outlet } from "react-router-dom";
import useAuthenicate, { useAuth } from '@hooks/auth.hook';
import HomeScreen, { DesktopHomeScreen } from "@components/Home/HomeScreen";
import { UserList } from "@components/Chat/ChatList";
import ChatScreen from "@components/Chat/ChatScreen";
import Forms from "@components/Auth/Forms";
import Settings from "@components/Settings/Settings";
import { Error404 } from "@common-utils";

const mobileRouter = [
    { path: "/", element: <HomeScreen /> },
    { path: '/users', element: <UserList /> },
    { path: '/chat/:phone', element: <ChatScreen /> }
];

const desktopRouter = [
    {
        path: "/",
        element: <DesktopHomeScreen />,
        children: [
            {
                index: true,
                element: <div>Select a chat.</div>
            },
            {
                path: "/chat/:phone",
                element: <ChatScreen />
            },
            {
                path: '/users',
                element: <UserList />
            }
        ]
    }
];

const staticRouter = [
    { path: "/login", element: <Forms section={"login"}/> },
    { path: "/register", element: <Forms section={"register"} /> },
    { path: "/settings", element: <Settings /> },
    { path: "*", element: <Error404 /> }
];

export function ProtectedLayout() {
    const { isLoading } = useAuthenticate();
    const { loggedIn } = useAuth();
    const location = useLocation();
   
    if (!loggedIn) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    
     if(isLoading) {
        return(<Loader />);
    }
    
    return <Outlet />;
}


export default function useRouter() {
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
    const selectedRouter = isDesktop ? desktopRouter : mobileRouter;
    
    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 768);        
        window.addEventListener('resize', handleResize);        
        return () => window.removeEventListener('resize', handleResize);
    }, []);
      
    const router = useMemo(() => createBrowserRouter([
    {
        element: <ProtectedLayout />,
        children: [...selectedRouter]
    },
    ...staticRouter
    ]), [selectedRouter]);
    
    return router;
}
