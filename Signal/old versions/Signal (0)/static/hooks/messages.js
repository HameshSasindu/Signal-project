import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@hooks/auth.js";
import { loadMessages } from "@redux/messages.js";
import { loadOnlines } from "@redux/onlineUsers.js";
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
    const socket = useSocket();
    const messages = useSelector((state) => state.messages);
    
    const auth = useAuth();
    if(!auth.isAuthenticated) return;
       
    useEffect(() => {
        if (!socket) return;
        messages.forEach(msg => {
            if(msg.receiver === auth.phone && !msg.delivered) {
                socket.emit("deliver", msg);    
            }    
        });                               
    }, [auth.phone, messages, socket]);
    
    return messages;
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