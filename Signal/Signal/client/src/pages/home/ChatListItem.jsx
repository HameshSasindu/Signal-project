import { useAuth } from '@hooks/auth';
import { useSocket } from '@hooks/socket';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@globals';
import { getRelativeTime } from '@hooks/time-utils';
import { useIsTyping } from '@store/typing';
import { useAllMessages } from '@hooks/messages';


export default function ChatListItem({ msg }) {
    const auth = useAuth();
    const socket = useSocket();
    
    const noti = useAllMessages();
    const [count, setCount] = useState(0);
    const navigate = useNavigate();
    
    const contact = () => {
        const isCurrentUserSender = msg.sender === auth.phone;
        return isCurrentUserSender ? msg.receiver : msg.sender;
    }      
    
    const isOwnChat = (msg.sender === auth.phone && msg.receiver === auth.phone);
    
    const phone = contact();
    const handleChat = () => navigate(`/chat/${phone}`);        
    
    useEffect(() => {
        const filters = noti.filter((n) => n.sender === phone && !n.read);
        setCount(filters.length);       
    }, [noti]);
    
    const typing = useIsTyping(phone);
    
    const Typing = () => {
        return (<p className="typing">Typing...</p>)
    }
    
    const CountDot = () => {
        return(
            <span className={`${count > 0 ? "active": ""}`}>{count}</span>
        );
    };
    
    const MessageCon = () => {
        const isOwnMsg = (msg.sender === auth.phone);    
        
        const iconMap = {
            none: <Icon name={"checkmark"} />,
            delivered: <Icon name={"checkmark-done"} />
        };
        
        const TickIcon = () => ( msg.delivered ? iconMap["delivered"] : iconMap["none"]);
        
        const MessageParagraph = ({ active=false }) => {
            return(
                 typing ? <Typing/> : <small className={`${active ? "active":""}`}>{msg.message}</small>
            );
        };        
        
        return(
            <>
                {isOwnMsg ? (<div className={`msg-con-home ${msg.read ? "read" : ""}`}>
                    <TickIcon />
                    <MessageParagraph />
                </div>) : (
                   !isOwnMsg && !msg.read ?
                       <MessageParagraph active={true} /> :
                       <MessageParagraph />
                )}
            </>
        );
    };
    
    return(
        <div className="chat" onClick={handleChat}>
            <div className="names">
                <img src="https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg" />
                <div className="name">
                    <b>{phone} {isOwnChat && "(You)"}</b>  
                    <MessageCon/>
                </div>        
            </div>
            <div className="meta">
                <small>{getRelativeTime(msg.timestamp)}</small>  
                <CountDot />
            </div>
        </div>        
    )    
}

