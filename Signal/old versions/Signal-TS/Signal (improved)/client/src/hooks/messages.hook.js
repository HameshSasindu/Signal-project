import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@hooks/auth.hook";

export function useAllMessages(socket) {
    const messages = useSelector((state) => state.messages.messages);
    
    const { userData } = useAuth();
    if(!userData) return;
    const user = userData.phone;
        
    useEffect(() => {
        messages.forEach(msg => {
            if(socket && msg.receiver === user && !msg.delivered) {
                socket.emit("deliver", msg);    
            }    
        });                               
    }, [user, messages, socket]);
    
    return messages;
}


export function useFetchAllMessages() {
    const { loggedIn } = useAuth();
    const dispatch = useDispatch();
    
    const { isLoading, data, error } = useQuery({
        queryKey: ['messages'],
        queryFn: async () => {
            const res = await axios.get("/api/all-messages");
            return res.data;
        },
        onSuccess: (data) => {
            dispatch(MessagesSlice.actions.loadMessages(data));
        },        
        enabled: loggedIn
    });  
    
    return {
        isLoading: isLoading
    }      
}

export function useLoadOnlineUsers() {
    const { loggedIn } = useAuth();
    const dispatch = useDispatch();
    
    const { isLoading, data, error } = useQuery({
        queryKey: ['onlineUsers'],
        queryFn: async () => {
            const res = await axios.get("/api/all-online");
            return res.data;
        },
        onSuccess: (data) => {
            dispatch(onlineSlice.actions.loadOnlines(data));
        },
        enabled: loggedIn
    });
    
    return {
        isLoading: isLoading,
        data: data
    };
}