import { useState, useEffect, useMemo } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { ProtectedLayout } from './Auth';

import HomeScreen, { DesktopHomescreen } from '@pages/home/index';
import ChatScreen from '@pages/chat/index';
import { UserList } from '@pages/home/ChatList';
import Forms from '@pages/auth/index';
import { Error404 } from '@globals';

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
    { path: "/login", element: <Forms prop={"login"}/> },
    { path: "/register", element: <Forms prop={"register"} /> },
    { path: "/settings", element: <Settings /> },
    { path: "*", element: <Error404 /> }
];




export default function SelectedRouter() {
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);    
    const selectedRouter = isDesktop ? desktopRouter : mobileRouter;
    
    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 768);        
        window.addEventListener('resize', handleResize);        
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    const router = useMemo(() => createBrowserRouter([{
        element: <ProtectedLayout />,
        children: [...selectedRouter]
    },
    ...staticRouter
    ]), [selectedRouter]);
        
    return <RouterProvider router={router}/>;    
}
