import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    deleteMessage,
    update,
    setDelivered,
    setRead
} from './slices/messagesSlice';
import { updateOnline, removeOnline } from "./slices/OnlineSlice";


function handleEvents() {
    const User = useSelector((state) => state.messages.userData);
    const dispatch = useDispatch();
    
    const handleSyncDelete = useCallback((data) => { 
        if(data.sender !== User.phone) {
            dispatch(deleteMessage(data.id));
        }       
    }, [dispatch, User.phone]);    
    
    const syncPrivateMessage = useCallback((data) => {
        if (data.sender === User.phone) {
            dispatch(update(data));  
        }    
    }, [dispatch, User.phone]);
        
    const handlePrivateMessage = useCallback((data) => {
        if (data.sender !== User.phone && data.receiver === User.phone) {
            dispatch(update(data));  
        }     
    }, [dispatch, User.phone]);
        
    const syncDelivered = useCallback((data) => {
        dispatch(setDelivered(data));  
    }, [dispatch, User.phone]);
    
    const syncRead = useCallback((data) => {
        dispatch(setRead(data));          
    }, [dispatch, User.phone]);
     
    
    return {handleSyncDelete, syncPrivateMessage, handlePrivateMessage, syncDelivered, syncRead};       
}

function SetupSocket() {
    const [socket, setSocket] = useState(null);       
    const loggedIn = useSelector((state) => state.messages.loggedIn);
    const userInfo = useSelector((state) => state.messages.userData);
    
    const dispatch = useDispatch();
     
    const {handleSyncDelete, syncPrivateMessage, handlePrivateMessage, syncDelivered, syncRead} = handleEvents();
    
    useEffect(() => {
        if(loggedIn && userInfo.phone) {
            const newSocket = io('http://localhost:5000', {
            	transports: ['websocket'],
            	upgrade: false,
            	withCredentials: true
            });            
            const loadOnline = (data) => dispatch(updateOnline(data));
            const removeOnline = (data) => dispatch(removeOnline(data));
            
            newSocket.on('connect', () => {
                setSocket(newSocket);
                newSocket.emit("online", { phone: userInfo.phone });
                
                newSocket.on("private_message", handlePrivateMessage);
                newSocket.on("sync_private", syncPrivateMessage);
                newSocket.on("sync_delivered", syncDelivered);
                newSocket.on("sync_delete", handleSyncDelete);
                newSocket.on("sync_read", syncRead);
                newSocket.on("user_online", loadOnline);
                newSocket.on("user_offline", removeOnline);
                newSocket.on("error", (error) => {
                    setError(error.error);
                });
                
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
            }; 
        }   
    }, [loggedIn, userInfo.phone]);   
        
    return socket;
}

export default SetupSocket;