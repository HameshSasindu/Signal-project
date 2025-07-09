import { useAuth } from '@hooks/auth';
import { useSocket } from '@hooks/socket';
import { useState } from 'react';
import { Icon } from '@globals';

export default function ChatInput() {
    const selectedChat = useSelectedChat();
    const socket = useSocket();
    const auth = useAuth();
    
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    
    const contact = { sender: auth.phone, receiver: selectedChat.phone };
    const handleInput = (e) => {
        setMessage(e.target.value);
        if(e.target.value.length > 0 && !isTyping) {
            socket.emit('typing', contact);
        } else if (e.target.value.length > 0 && isTyping) {
            socket.emit('typing', contact);
        } else if(e.target.value.length === 0 && isTyping){
            socket.emit('stop_typing', contact);
        }
    };

    const sendMessage = () => {
        if(!message.trim()) return;
        
        const newMessage = {
            sender: auth.phone,
            receiver: selectedChat.phone,
            message: message
        }        
        
        socket.emit("private_message", newMessage);        
        socket.emit('stop_typing', contact);
        
        setMessage('');
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