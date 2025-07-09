function ChatScreen() {
    const socket = React.useContext(Socket);
    const User = React.useContext(UserContext);

    const [messages, setMessages] = React.useState([]);    
    const [error, setError] = React.useState(null);
    const bottomRef = React.useRef(null);
    
    const { phone } = ReactRouterDOM.useParams();       
    const {setSelected: setUser} = React.useContext(SelectedUser);
        
    const [isTyping, setIsTyping] = React.useState(false); 
    const [typing, setTyping] = React.useState(false);
    
    React.useEffect(() => {
        toggleBody("chat-screen", true);                
        return () => toggleBody("chat-screen", false); 
    }, []);
    
    React.useEffect(() => {
        socket.emit("private_messages", User.phone, phone);    
        
        const handlePrivateMessages = (messages) => setMessages(messages);
        
        const handleSyncDelete = ({ sender, receiver, message_id }) => {
            setMessages((prev) => prev.filter((msg) => msg.id !== message_id));
};
            
        socket.on("private_messages", handlePrivateMessages);       
        socket.on("sync_delete", handleSyncDelete);
        socket.on("error", (error) => {
            setError(error.error);
        });
        
        return () => {
            socket.off("private_messages", handlePrivateMessages);  
            socket.off("sync_delete", handleSyncDelete);
            socket.off("error");
        };  
    }, [phone]);
    
    React.useEffect(() => {
        bottomRef.current?.scrollIntoView({behavior: 'smooth'});
    }, [messages]);
    
    if (error) {
        return(<Error404 error={error} />);
    }
    
    return(
        <div className="wrapper">
            <ContactBar phone={phone} typing={typing}/>            
            <Replies messages={messages}/>
            <ChatInput
                receiver={phone}
                setMessages={setMessages}
                isTyping={isTyping}
                setIsTyping={setIsTyping}
                setTyping={setTyping}
            />
            <div ref={bottomRef}></div>
        </div>
    )   
}
