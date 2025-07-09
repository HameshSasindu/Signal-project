function ChatInput({ receiver, setMessages, isTyping, setIsTyping, setTyping}) {
    const [message, setMessage] = React.useState('');
    const socket = React.useContext(Socket);
    const sender = React.useContext(UserContext);

    const handleInput = (e) => {
        setMessage(e.target.value);
        if(e.target.value.length > 0 && !isTyping) {
            socket.emit('typing', { sender: sender.phone, receiver: receiver });
            setIsTyping(true);
        }else if(e.target.value.length === 0 && isTyping){
            socket.emit('stop_typing', { sender: sender.phone, receiver: receiver });
            setIsTyping(false);
        }
    };

    const sendMessage = () => {
        if(!message.trim()) return;
        const newMessage = {
            sender: sender.phone,
            receiver: receiver,
            message: message,
            timestamp: new Date().toISOString()
        }        
        socket.emit("private_message", newMessage);        
        socket.emit('stop_typing', { sender: sender.phone, receiver: receiver });
        setMessages((prev) => [...prev, newMessage]);
        setMessage('');
     };
    
    React.useEffect(() => {
        socket.on("private_message", (msg) => {
            if(msg.receiver === sender.phone || msg.receiver === receiver) {
                setMessages((prev) => [...prev, msg]);
            }
        });
        
        socket.on('typing', (data) => {
            if(data.sender === receiver) {
                setTyping(true);    
            }    
        });
        
        socket.on('stop_typing', (data) => {            
            setTyping(false); 
        });
        
        return () => {
            socket.off('typing');
            socket.off('stop_typing');
            socket.off("private_message")          
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

function ContactBar({ phone, typing}) {
    const back = () => history.back();
    const userData = React.useContext(UserContext);

    return(
        <div className="topBar">
            <button onClick={back}><Icon name={"arrow-back"}/></button>
            <div className="">
                <p>{phone} {userData.phone === phone ? "(You)":""}</p>
                {typing && <p className="typing">Typing...</p>}
            </div> 
        </div>
    );    
}

function toggleBody(className, shouldAdd) {
  if (shouldAdd) {
    document.body.classList.add(className);
  } else {
    document.body.classList.remove(className);
  }
}

