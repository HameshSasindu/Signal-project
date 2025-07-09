import { useState, useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Socket, Icon } from "./../common.js";
import { useNavigate } from "react-router-dom";
import { getRelativeTime } from "./chat-func.js";

export function AddButton() {
    const navigate = useNavigate();
    return(
        <button className="adder" onClick={() => navigate('/users')}>+</button>  
    );  
}

export default function ListItem({ msg }) {
    const userData = useSelector((state) => state.messages.userData);
    const noti = useSelector((state) => state.messages.messages);
    
    const [count, setCount] = useState(0);
    const [typing, setTyping] = useState(false);
    const socket = useContext(Socket);
    const navigate = useNavigate();
       
    const contact = () => {
        const isCurrentUserSender = msg.sender === userData.phone;
        return isCurrentUserSender ? msg.receiver : msg.sender;
    }      
    
    const you = (msg.sender === userData.phone && msg.receiver === userData.phone ? "(You)" : "");    
    
    const phone = contact();
    const handleChat = () => navigate(`/chat/${phone}`);        
    
    useEffect(() => {
        const filters = noti.filter((n) => n.sender === phone && !n.read);
        setCount(filters.length);       
    }, [noti])
    
    useEffect(() => {
        if(!socket) return;
        socket.on('typing', (data) => {
            if(data.sender === phone) setTyping(true);
        });        
        socket.on('stop_typing', (data) => setTyping(false));
                
        return () => {
            socket.off('typing');
            socket.off('stop_typing');
        }        
    }, [phone, socket]);
    
    const Typing = () => {
        return (<p className="typing">Typing...</p>)
    }
    
    const MessageCon = () => {
        const ownMsg = (msg.sender === userData.phone);    
        
        const iconMap = {
            none: <Icon name={"checkmark"} />,
            delivered: <Icon name={"checkmark-done"} />
        };
    
        return(
            <>
                {ownMsg ? (<div className={`msg-con-home ${msg.read ? "read" : ""}`}>
                    {msg.delivered ? iconMap["delivered"] : iconMap["none"]}
                    <small>{msg.message}</small>
                </div>) : (
                    <small>{msg.message}</small>
                )}
            </>
        );
    };
    
    return(
        <div className="chat" onClick={handleChat}>
            <div className="names">
                <img src="https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg" />
                <div className="name">
                    <b>{phone} {you}</b>  
                    {typing ? <Typing/> : <MessageCon/>}
                </div>        
            </div>
            <div className="meta">
                <small>{getRelativeTime(msg.timestamp)}</small>  
                <span className="active">{count}</span>
            </div>
        </div>        
    )    
}

