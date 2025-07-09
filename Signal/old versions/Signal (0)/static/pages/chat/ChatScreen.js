function ChatScreen() {
    const socket = useSocket();    
    const auth = useAuth();
        
    const { phone } = ReactRouterDOM.useParams(); 
          
    const [online, setOnline] = React.useState(false);
    const [lastSeen, setLastSeen] = React.useState(null);
    
    const Messages = ReactRedux.useSelector((state) => state.messages);
    
    const [error, setError] = React.useState(null);
    const bottomRef = React.useRef(null);

    const typing = useIsTyping(phone);
    
    React.useEffect(() => {
        if (!socket) return;
        socket.on("user_online", (data) => {
            if(data.user === phone)  setOnline(true);   
        });        
        return () => socket.off("user_online");   
    }, [phone, socket]);
    
    React.useEffect(() => {
        document.body.classList.add("chat-screen");
        return () => document.body.classList.remove("chat-screen");
    }, []);
    
    React.useEffect(() => {
        bottomRef.current?.scrollIntoView({behavior: 'smooth'});
    }, [Messages]);
    
    if(!socket) {
        return(<Loader />); 
    }
    
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
            />
            <div ref={bottomRef}></div>
        </div>
    )   
}
