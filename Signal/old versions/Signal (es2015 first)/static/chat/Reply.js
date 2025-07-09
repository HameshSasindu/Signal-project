import { useState, useContext, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Socket } from "./../common.js";
import OptionList from "./OptionList.js";

export function Reply({ msg }) {
    const socket = useContext(Socket);
    const sender = useSelector((state) => state.messages.userData);
    const ownMsg = (msg.sender === sender.phone);    
    
    const [showOptions, setShowOptions] = React.useState(false);
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
    
    return(                      
        <div className={`reply relative ${ownMsg ? "own" : ""}`}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchCancel}
        >
            <span className="msg-text">{msg.message}
                <span className="time">{formatTime(msg.timestamp)}</span>
                {ownMsg && <small className={`status ${msg.read ? "read" : ""}`}> {msg.delivered ? iconMap["delivered"] : iconMap["none"]}</small> }
            </span> 
            {showOptions && <OptionList msg={msg} />}
        </div>        
    );
}



export default function Replies({ phone }) {
    const [filtered, setFiltered] = useState([]);
    const User = useSelector((state) => state.messages.userData);
    const Messages = useSelector((state) => state.messages.messages);
    const socket = useContext(Socket);
    
    useEffect(() => {
        const filteredMsg = Messages.filter((msg) => 
            (msg.receiver === User.phone && msg.sender === phone) ||
            (msg.sender === User.phone && msg.receiver === phone));
        
        setFiltered(filteredMsg);        
        
        filteredMsg.forEach(msg => {
            if(msg.receiver === User.phone && !msg.read) {
                socket.emit("reading", msg);  
            }
        });
    }, [Messages, phone, socket, User.phone]);
      
    if(!filtered.length) {
        return(<p>Say Hi...</p>);      
    }
  
    return(
        <div className="chat-container">
            {filtered.map((msg, i) => (
                <Reply key={msg.id} msg={msg} />   
            ))}            
        </div>
    )    
}