import { useState, useContext, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { Socket, Error404 } from "./../common.js";
import ChatInput from "./ChatInput.js";
import ContactBar from "./ContactBar.js";
import Replies from "./Reply.js";

function ChatScreen() {
    const socket = useContext(Socket);
    const User = useSelector((state) => state.messages.userData);
    const { phone } = useParams(); 
          
    const [online, setOnline] = useState(false);
    const [lastSeen, setLastSeen] = useState(null);
    
    const Messages = useSelector((state) => state.messages.messages);
    
    const [error, setError] = useState(null);
    const bottomRef = useRef(null);

    const [typing, setTyping] = useState(false);
    
    useEffect(() => {
        socket.on("user_online", (data) => {
            if(data.user === phone)  setOnline(true);   
        });        
        return () => socket.off("user_online");   
    }, [phone]);
    
    useEffect(() => {
        document.body.classList.add("chat-screen");
        return () => document.body.classList.remove("chat-screen");
    }, []);
    
    useEffect(() => {
        bottomRef.current?.scrollIntoView({behavior: 'smooth'});
    }, [Messages]);
    
    if (error) {
        return(<Error404 error={error} />);
    }
    
    return(
        <div className="wrapper">
            <ContactBar phone={phone} typing={typing}/>            
            <Replies phone={phone} />
            <ChatInput
                receiver={phone}
                typing={typing}
                setTyping={setTyping}
            />
            <div ref={bottomRef}></div>
        </div>
    )   
}
