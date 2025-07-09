import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";

import { useAllMessages, useLoadOnlineUsers, useFetchAllMessages } from "@hooks/messages.hook";
import useRouter from "@hooks/Router";
import { Socket, InitialLoader } from "@common-utils";
import useAuthenticate, { useAuth } from '@hooks/auth.hook';
import useSocket from "@hooks/socket.hook";
import store from "@redux/store";
import './css/root.scss';

const queryClient = new QueryClient();
 
export function Root() {  
    const { isLoading: authLoading } = useAuthenticate();
    const { loggedIn, userInfo } = useAuth();
    
    const socket = useSocket();
    const { isLoading: messagesLoading } = useFetchAllMessages();
    const allMessages = useAllMessages(socket);
    const { isLoading: onlineUsersLoading } = useLoadOnlineUsers();
    
    const router = useRouter();   
                
    const isAppLoading = authLoading || (loggedIn && (messagesLoading || onlineUsersLoading));

    if (isAppLoading) return(<InitialLoader />);       
   
    return(
        <Socket.Provider value={socket}>
            <RouterProvider router={router}/>
        </Socket.Provider>
    );
}


export default function App() {
    return(
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <Root />
            </QueryClientProvider>            
        </Provider>
    );  
}
