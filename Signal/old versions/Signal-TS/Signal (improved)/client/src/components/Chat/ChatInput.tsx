import React, { useState, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Socket, Icon } from "@common-utils";
import { useAuth } from "@hooks/auth.hook";
import { ChatScreenItems, contactPayload } from "@ts/chat";



function useHandleTyping(
    contact: contactPayload,
    setIsTyping: React.Dispatch<React.SetStateAction<boolean>>,
    setTyping: boolean 
) : void {
    const socket = useContext(Socket);
    
    if(setTyping) {
        socket.emit('typing', contact);
        setIsTyping(true);         
    }else {
        socket.emit('stop_typing', contact);
        setIsTyping(false);    
    }    
}

export default function ChatInput({ receiver }: ChatScreenItems) {
    const socket = useContext(Socket);
    const [message, setMessage] = useState('');    
    const { userInfo: User } = useAuth();  
    const dispatch = useDispatch();
    const [isTyping, setIsTyping] = useState(false);
    
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
        
        const contact = {
            sender: User.phone,
            receiver: receiver
        } as ContactPayload;        
        
        if(e.target.value.length > 0 && !isTyping) {
            useHandleTyping(contact, setIsTyping, true);
        } else if (e.target.value.length > 0 && isTyping) {
            useHandleTyping(contact, setIsTyping, true);
        }else if(e.target.value.length === 0 && isTyping){
            useHandleTyping(contact, setIsTyping, false);
        }
    };

    const sendMessage = () => {
        if(!message.trim()) return;
        
        const newMessage = {
            sender: User.phone,
            receiver: receiver,
            message: message
        }        
        
        socket.emit("private_message", newMessage);        
        socket.emit('stop_typing', { sender: User.phone, receiver: receiver });
        
        setMessage('');
        setIsTyping(false);
        socket.emit('stop_typing', contact);
     };       

    return(
        <div className="input-in">
            <div className="in-put relative">
              <input
                type="text"
                placeholder="Send a message"
                className="input"
                onChange={handleInput}
                value={message}
              />
              <button className="send" onClick={sendMessage}><Icon name={"send-outline"}/></button>
             
            </div>
        </div>
    );
}
