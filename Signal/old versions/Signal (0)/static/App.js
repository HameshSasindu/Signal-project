import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useAuthenticate, { useAuth } from '@hooks/auth.js';
import { useFetchAllMessages, useAllMessages, useLoadOnlineUsers } from '@hooks/messages.js';
import SocketProvider from '@hooks/socket.js';
import SelectedRouter from '@hooks/Router.js';
import ReduxProvider from '@redux/store.js';
import { InitialLoader } from '@globals';

const queryClient = new QueryClient();
 
export function Root() {  
    const { isLoading: authLoading } = useAuthenticate();
    const auth = useAuth();
    const { isLoading: messagesLoading } = useFetchAllMessages();
    useAllMessages();
    const { isLoading: onlineUsersLoading } = useLoadOnlineUsers();
        
    const isAppLoading = authLoading || (auth.isAuthenticated && (messagesLoading || onlineUsersLoading));

    if (isAppLoading) return(<InitialLoader/>);
   
    return(
        <SocketProvider>
            <SelectedRouter />
        </SocketProvider>
    );
}

export default function App() {
    return (
         <ReduxProvider>
             <QueryClientProvider client={queryClient}>
                 <Root />
             </QueryClientProvider>            
         </ReduxProvider>
    );    
}



