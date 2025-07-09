import { useAuth } from '@hooks/auth';
import { useSocket } from '@hooks/socket';
import { useParams } from 'react-router-dom';
import { useState, useEffect, createContext, useContext, useRef } from 'react';
import { Loader, Error404 } from '@globals';
import ContactBar, { SelectedChatProvider } from './ContactBar';
import ChatInput from './ChatInput';
import Replies from './Reply';

export const SelectedChat = createContext(undefined);

export function useSelectedChat() {
    const context = useContext(SelectedChat);
    if (context === undefined) {
        throw new Error("useSelectedChat must be used within a SelectedChatProvider");
    };
    return context;
}

export default function ChatScreen() {
    const socket = useSocket();    
    const auth = useAuth();
        
    const { phone } = useParams();    
    //const messages = useFilteredMessages(phone);
    
    const [error, setError] = useState(null);
    const bottomRef = useRef(null);
        
    useEffect(() => {
        document.body.classList.add("chat-screen");
        return () => document.body.classList.remove("chat-screen");
    }, []);
    
    useEffect(() => {
        bottomRef.current?.scrollIntoView({behavior: 'smooth'});
    }, []);
    
    if(!socket) return(<Loader />);     
    if (error) return(<Error404 error={error} />);
    
    return(
        <div className="wrapper">
            <SelectedChatProvider phone={phone}>
                <ContactBar />            
                <Replies />
                <ChatInput />
                <div ref={bottomRef}></div>
            </SelectedChatProvider>
        </div>
    )   
}
