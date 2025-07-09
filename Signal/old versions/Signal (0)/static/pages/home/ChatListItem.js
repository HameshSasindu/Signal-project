function useIsTyping(phone) {
    const typingList = ReactRedux.useSelector((state) => state.typing);
    return typingList.includes(phone);
}


function ListItem({ msg }) {
    const auth = useAuth();
    const socket = useSocket();
    
    const noti = ReactRedux.useSelector((state) => state.messages);
    const [count, setCount] = React.useState(0);
    const navigate = ReactRouterDOM.useNavigate();
       
    const contact = () => {
        const isCurrentUserSender = msg.sender === auth.phone;
        return isCurrentUserSender ? msg.receiver : msg.sender;
    }      
    
    const you = (msg.sender === auth.phone && msg.receiver === auth.phone ? "(You)" : "");    
    
    const phone = contact();
    const handleChat = () => navigate(`/chat/${phone}`);        
    
    React.useEffect(() => {
        const filters = noti.filter((n) => n.sender === phone && !n.read);
        setCount(filters.length);       
    }, [noti]);
    
    const typing = useIsTyping(phone);
    
    const Typing = () => {
        return (<p className="typing">Typing...</p>)
    }
    
    const CountDot = () => {
        return(
            <span className={`${count > 0 ? "active": ""}`}>{count}</span>
        );
    };
    
    const MessageCon = () => {
        const ownMsg = (msg.sender === auth.phone);    
        
        const iconMap = {
            none: <Icon name={"checkmark"} />,
            delivered: <Icon name={"checkmark-done"} />
        };
        
        const TickIcon = () => (
            msg.delivered ? iconMap["delivered"] : iconMap["none"]
        );
        
        const MessageParagraph = ({ active=false }) => {
            return(
                <small className={`${active ? "active":""}`}>{msg.message}</small>
            );
        };        
        
        return(
            <>
                {ownMsg ? (<div className={`msg-con-home ${msg.read ? "read" : ""}`}>
                    <TickIcon />
                    <MessageParagraph />
                </div>) : (
                   !ownMsg && !msg.read ?
                       <MessageParagraph active={true} /> :
                       <MessageParagraph />
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
                <CountDot />
            </div>
        </div>        
    )    
}

