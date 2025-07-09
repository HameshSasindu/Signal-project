import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useAuthenticate, { useAuth } from '@hooks/auth';
import { useFetchAllMessages, useMessageDelivery, useLoadOnlineUsers } from '@hooks/messages';
import ReduxProvider from '@store/index';
import SocketProvider from '@hooks/socket';
import AppRouter from '@hooks/Router';
import { InitialLoader } from '@globals';

const queryClient = new QueryClient();
 
export function Root() {  
    const { isLoading: authLoading } = useAuthenticate();
    const auth = useAuth();
    
    const { isLoading: messagesLoading } = useFetchAllMessages();
    useMessageDelivery();
    const { isLoading: onlineUsersLoading } = useLoadOnlineUsers();
        
    const isAppLoading = authLoading || (auth.isAuthenticated && (messagesLoading || onlineUsersLoading));

    if (isAppLoading) return(<InitialLoader/>);
       
    return(
        <SocketProvider>
            <AppRouter />
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