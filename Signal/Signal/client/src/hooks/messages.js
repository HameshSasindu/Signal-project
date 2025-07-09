import { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./auth";
import { loadMessages } from "@store/messages";
import { loadOnlines } from "@store/online";
import { useSocket } from "./socket";
import axios from 'axios';

export function useFetchAllMessages() {
    const auth = useAuth();
    const dispatch = useDispatch();
    
    const { isLoading, data, error } = useQuery({
        queryKey: ['messages'],
        queryFn: async () => {
            const res = await axios.get("/api/all-messages");
            return res.data;
        },
        onSuccess: (data) => {
            dispatch(loadMessages(data));
        },        
        enabled: auth.isAuthenticated
    });  
    
    return {
        isLoading: isLoading
    }      
}

export function useAllMessages() {
    const messages = useSelector((state) => state.messages);
    return messages;
}

export function useMessageDelivery() {
    const auth = useAuth();
    const socket = useSocket();
    const messages = useAllMessages();
        
    const undeliveredMsgs = useMemo(() => messages.filter(msg => msg.receiver === auth.phone && !msg.delivered), [messages, auth.phone]);
     
    useEffect(() => {
        if (!socket || !auth.isAuthenticated || !undeliveredMsgs.length) return;
                
        undeliveredMsgs.forEach(msg => {
            socket.emit("deliver", msg);    
        });                               
    }, [auth.phone, undeliveredMsgs, socket]);
}

export function useLoadOnlineUsers() {
    const auth = useAuth();
    const dispatch = useDispatch();
    
    const { isLoading, data, error } = useQuery({
        queryKey: ['onlineUsers'],
        queryFn: async () => {
            const res = await axios.get("/api/all-online");
            return res.data;
        },
        onSuccess: (data) => {
            dispatch(loadOnlines(data));
        },
        enabled: auth.isAuthenticated
    });
    
    return {
        isLoading: isLoading,
        data: data
    };
}
