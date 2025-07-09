import { useState, useCallback, useEffect, createContext, useContext } from 'react';
import { useDispatch } from 'react-redux';

import { useAuth } from './auth';
import { deleteMessage, update, setDelivered, setRead } from '@store/messages';
import { removeOnline, updateOnline } from '@store/online';
import { add, remove } from '@store/typing';
import { io } from 'socket.io-client';

const Socket = createContext(null);

function handleEvents() {
    const auth = useAuth();
    const dispatch = useDispatch();
    
    const handleSyncDelete = useCallback((data) => { 
        if(data.sender !== auth.phone) {
            dispatch(deleteMessage(data.id));
        }       
    }, [dispatch, auth.phone]);    
    
    const syncPrivateMessage = useCallback((data) => {
        if (data.sender === auth.phone) {
            dispatch(update(data));  
        }    
    }, [dispatch, auth.phone]);
        
    const handlePrivateMessage = useCallback((data) => {
        if (data.sender !== auth.phone && data.receiver === auth.phone) {
            dispatch(update(data));  
        }     
    }, [dispatch, auth.phone]);
        
    const syncDelivered = useCallback((data) => {
        dispatch(setDelivered(data));  
    }, [dispatch, auth.phone]);
    
    const syncRead = useCallback((data) => {
        dispatch(setRead(data));          
    }, [dispatch, auth.phone]);
     
    
    return {handleSyncDelete, syncPrivateMessage, handlePrivateMessage, syncDelivered, syncRead};       
}

export default function SocketProvider({ children }) {
    const [socket, setSocket] = useState(null);  
     
    const dispatch = useDispatch();    
    const auth = useAuth();
        
    const {handleSyncDelete, syncPrivateMessage, handlePrivateMessage, syncDelivered, syncRead } = handleEvents();
    
    const isEventForMe = useCallback((data) => {
        return data.receiver === auth.phone && data.sender !== auth.phone;
    }, [auth.phone]);

    const handleStartTyping = useCallback((data) => {
        if(isEventForMe(data)) {
            dispatch(add(data.sender));
        }
    }, [auth.phone]);

    const handleStopTyping = useCallback((data) => {
        if(isEventForMe(data)) {
            dispatch(remove(data.sender));
        }
    }, [auth.phone]);
        
   useEffect(() => {
        if(auth.isAuthentcated && auth.phone) {
            const newSocket = io('http://localhost:5000', {
                transports: ['websocket'],
                upgrade: false,
                withCredentials: true
            });            
            const loadOnline = (data) => dispatch(updateOnline(data));
            const deleteOnline = (data) => dispatch(removeOnline(data));
            
            newSocket.on('connect', () => {
                setSocket(newSocket);
                newSocket.emit("online", { phone: auth.phone });
                
                newSocket.on("private_message", handlePrivateMessage);
                newSocket.on("sync_private", syncPrivateMessage);
                newSocket.on("sync_delivered", syncDelivered);
                newSocket.on("sync_delete", handleSyncDelete);
                newSocket.on("sync_read", syncRead);
                newSocket.on("user_online", loadOnline);
                newSocket.on("user_offline", deleteOnline);
                newSocket.on("error", (error) => {
                    setError(error.error);
                });
                newSocket.on("typing", handleStartTyping);
                newSocket.on("stop_typing", handleStopTyping);
            });     
            newSocket.on('connect_failed', () => {
                console.error("Socket connection failed");
            });

            newSocket.on('disconnect', () => {
                console.log("socket disconnected.");
            });

            return () => {
                if (newSocket) newSocket.disconnect();
                                
                newSocket.off("private_message", handlePrivateMessage);
                newSocket.off("sync_private", syncPrivateMessage);
                newSocket.off("sync_delivered", syncDelivered);
                newSocket.off("sync_delete", handleSyncDelete);
                newSocket.off("sync_read", syncRead);
                newSocket.off("user_online", loadOnline);
                newSocket.off("error");
                newSocket.off("typing", handleStartTyping);
                newSocket.off("stop_typing", handleStopTyping);
            }; 
        }   
    }, [auth.isAuthenticated, auth.phone]);   
        
    return(
        <Socket.Provider value={socket}>           
            { children }            
        </Socket.Provider>
    );
}


export function useSocket() {
    const socket = useContext(Socket);
    if(!socket) return;
    return socket;
}
