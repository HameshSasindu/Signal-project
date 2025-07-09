import { useState, useEffect, useContext, useRef } from "react";
import { Socket } from "@/common.js";
import { useAuth } from '@hooks/auth.hook.js';
import { useNavigate } from "react-router-dom";
import { useFilterMessages } from "./hooks/replies.hook.js";
import { Message, UserInfo } from "@types";

function Reply({ msg }: Message) {
    const { userInfo: sender } = useAuth<UserInfo>();
    const socket = React.useContext(Socket);
    
    const ownMsg = (msg.sender === sender.phone);    
    
    const [showOptions, setShowOptions] = useState(false);
    const holdTimeout = useRef(null);
    const navigate = useNavigate();
    
    const handleTouchStart = () => {
        holdTimeout.current = setTimeout(() => {
          setShowOptions(true);
          navigate("#options");
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
    
    const formatTime = (iso) => {
        const date = new Date(iso);
        return new Intl.DateTimeFormat(undefined, {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).format(date);
    }    
    
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
        <div className={`reply relative ${ownMsg ? "own" : ""}`}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchCancel}
        >
            <span className="msg-text">{msg.message}
                <span className="time">{formatTime(msg.timestamp)}</span>
                {ownMsg && <DeliverTick /> }
            </span> 
            {showOptions && <OptionList msg={msg} />}
        </div>        
    );
}





export default function Replies({ phone }: ) {
    const filteredMessages = useFilterMessages(phone);
      
    if(!filteredMessages.length) {
        return(<p>Say Hi...</p>);      
    }
  
    return(
        <div className="chat-container">
            {filteredMessages.map((msg, i) => (
                <Reply key={msg.id} msg={msg} />   
            ))}            
        </div>
    )    
}
