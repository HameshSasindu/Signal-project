import { useAuth } from '@hooks/auth';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { formatLastSeen } from '@hooks/time-utils';
import { useIsTyping } from '@store/typing';
import { Icon } from '@globals';
import { SelectedChat, useSelectedChat } from './ChatScreen';

export function SelectedChatProvider({ phone, children }) {
    const onlineUsers = useSelector((state) => state.onlineUsers);
    
    const [check, setCheck] = useState(false);    
    const [lastSeen, setLastSeen] = useState(null);    
    const [online, setOnline] = useState(false);
    
    useEffect(() => {
        if (onlineUsers.has(phone)) {
            setOnline(true);    
            setCheck(false);
        } else {
            setCheck(true);
            setOnline(false);
        }
    }, [onlineUsers, phone]);
    
    const userData = useQuery({
        queryKey: ['lastseen', phone],
        queryFn: async () => {
            try {
                const res = await axios.get(`/api/online/${phone}`);
                if (res.data.time) setLastSeen(res.data.time);
            } catch(e) {
                throw new Error(e);
            }
        },
        enabled: check && !!phone,
        refetchOnWindowFocus: false,
        staleTime: 2 * 60 * 1000,
    });        
        
    const selectedChatValue = {
        phone: phone,
        online: online,
        lastSeen: lastSeen
    };
        
    return (
        <SelectedChat.Provider value={selectedChatValue}>
            { children }
        </SelectedChat.Provider>
    )
}


function StatusOfUser() {
    const { phone, online, lastSeen } = useSelectedChat();
    const typing = useIsTyping(phone);    
    
    const Typing = () => {return(<p className="typing">Typing...</p>)};
    const Online = () => {return(<p className="online">Online</p>)};
    const LastSeen = () => {return(<p className="online">{formatLastSeen(lastSeen)}</p>)};  
    
    return(
        <>
            {
                typing ? (<Typing/>) :
                online ? (<Online/>) :
                lastSeen ? (<LastSeen/>) : null
            }
        </>   
    )      
}

export default function ContactBar() {
    const auth = useAuth();
    const selectedChat = useSelectedChat();
    
    const isOwnChat = (auth.phone === selectedChat.phone);
    const back = () => history.back();
          
    return(
        <div className="topBar">
            <button onClick={back}><Icon name={"chevron-back"}/></button>
            <div className="">
                <b>{selectedChat.phone} {isOwnChat && "(You)"}</b>
                <StatusOfUser />
            </div> 
        </div>
    );    
}

