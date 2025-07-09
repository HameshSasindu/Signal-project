import { useAuth } from '@hooks/auth';
import { useSocket } from '@hooks/socket';
import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '@globals';
import { formatHour } from '@hooks/time-utils';
import Options from './OptionList';
import { useAllMessages } from '@hooks/messages';
import { useSelectedChat } from './ChatScreen';

export function Reply({ msg, onHold }) {
    const auth = useAuth();
    const isOwnMsg = (msg.sender === auth.phone);
    
    const holdTimeout = useRef(null);
        
    const handleTouchStart = () => {
        holdTimeout.current = setTimeout(() => {
            onHold(msg.id);
        }, 500);
    };
    const handleTouchEnd = () => {
        if (holdTimeout.current) {
          clearTimeout(holdTimeout.current);
          holdTimeout.current = null;
        }
    };
    const handleTouchCancel = () => {
        if (holdTimeout.current) {
            clearTimeout(holdTimeout.current);
            holdTimeout.current = null;
        }
    };
   
    const iconMap = {
        none: <Icon name={"checkmark"} />,
        delivered: <Icon name={"checkmark-done"} />
    };
    
    const DeliverTick = () => {
      return(
        <small className={`status ${msg.read ? "read" : ""}`}>
            {msg.delivered ? iconMap["delivered"] : iconMap["none"]}
        </small>    
       );
    }
    
    
    return(                      
        <div className={`reply relative ${isOwnMsg ? "own" : ""}`}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchCancel}
        >
            <span className="msg-text">{msg.message}
               <span className="time">{formatHour(msg.timestamp)}</span>
               {isOwnMsg && <DeliverTick /> }
            </span> 
        </div>        
    );
}

export function useFilteredMessages(phone) {
    const auth = useAuth();
    const messages = useAllMessages();    
    const selectedChat = useSelectedChat();
    const [filtered, setFiltered] = useState([]);
    const selectedChatPhone = phone ? phone : selectedChat.phone;

    useEffect(() => {
        const filteredMsg = messages.filter((msg) => 
            (msg.receiver === auth.phone && msg.sender === selectedChatPhone) ||
            (msg.sender === auth.phone && msg.receiver === selectedChatPhone));
        
        setFiltered(filteredMsg);        
    }, [messages, selectedChat.phone, socket, auth.phone]);    
    
    return filtered;
}

function useMessageRead() {
    const socket = useSocket();
    const auth = useAuth();
    const filtered = useFilteredMessages();
    
    const unreadMsgs = filtered.filter(msg => msg.receiver === auth.phone && !msg.read);
    
    useEffect(() => {
        unreadMsgs.forEach(msg => {
            socket.emit("read", msg);  
        });
    }, [unreadMsgs, socket, auth.phone]);    
}

export function useOverlayHandler() {
    const [activeMessageId, setActiveMessageId] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handlePopState = () => {
            if (location.state && location.state.overlayMessageId) {
                setActiveMessageId(null);
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [location.state]);
    
    const openOptions = (messageId) => {
        setActiveMessageId(messageId);
        navigate(location.pathname, {
            state: { ...location.state, overlayMessageId: messageId },
            replace: false
        });
    };
    
    const closeOptions = () => {
        setActiveMessageId(null);
        navigate(-1);
    };
    
    return { activeMessageId, openOptions, closeOptions };
}

export default function Replies() {
    const filteredMessages = useFilteredMessages();
    useMessageRead();
    
    const { activeMessageId, openOptions, closeOptions } = useOverlayHandler();
    
    const activeMessage = filteredMessages.find(msg => msg.id === activeMessageId);
      
    if(!filteredMessages.length) {
        return(<p>Say Hi...</p>);      
    }
  
    return(
        <div className="chat-container">
            {filteredMessages.map((msg, i) => (
                <Reply key={msg.id} msg={msg} onHold={() => openOptions(msg.id)} />   
            ))}   
            
            {activeMessage && (
                <Options
                    msg={activeMessage}
                    onClose={closeOptions}
                />         
            )}
        </div>
    )    
}
