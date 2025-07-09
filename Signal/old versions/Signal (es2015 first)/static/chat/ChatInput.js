import { useState, useContext, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Socket } from "./../common.js";

function ChatInput({ receiver, typing, setTyping}) {
    const socket = useContext(Socket);
    const User = useSelector((state) => state.messages.userData);
    const [message, setMessage] = useState('');    
        
    const dispatch = useDispatch();
    
    const handleInput = (e) => {
        setMessage(e.target.value);
        const conats = { sender: User.phone, receiver: receiver };
        if(e.target.value.length > 0 && !typing) {
            socket.emit('typing', conats);
        } else if (e.target.value.length > 0 && typing) {
            socket.emit('typing', conats);
        }else if(e.target.value.length === 0 && typing){
            socket.emit('stop_typing', conats);
        } else {
            socket.emit('stop_typing', conats);
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
     };
    
    useEffect(() => {
        socket.on('typing', (data) => {
            if(data.receiver === User.phone && data.sender !== User.phone) {
                setTyping(true);
            }
        });
        
        socket.on('stop_typing', (data) => {            
            setTyping(false); 
        });
                
        return () => {
            socket.off('typing');
            socket.off('stop_typing');
        }        
    }, [receiver]);

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
