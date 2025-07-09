function Reply({ msg, onHold }) {
    const auth = useAuth();
    const ownMsg = (msg.sender === auth.phone);    
    const socket = useSocket();
    
    const holdTimeout = React.useRef(null);
        
    const handleTouchStart = () => {
        holdTimeout.current = setTimeout(() => {
            onHold(msg.id);
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
    
    const DeliverTick = () => {
      return(
        <small className={`status ${msg.read ? "read" : ""}`}>
            {msg.delivered ? iconMap["delivered"] : iconMap["none"]}
        </small>    
       );
    }
    
    
    return(                      
        <div className={`reply relative ${ownMsg ? "own" : ""}`}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchCancel}
        >
            <span className="msg-text">{msg.message}
                <span className="time">{formatTime(msg.timestamp)}</span>
                {ownMsg && <DeliverTick /> }
            </span> 
        </div>        
    );
}


function useFilterMessages(phone) {
    const socket = useSocket();
    const auth = useAuth();
    
    const Messages = ReactRedux.useSelector((state) => state.messages);
    const [filtered, setFiltered] = React.useState([]);    
    
    React.useEffect(() => {
        const filteredMsg = Messages.filter((msg) => 
            (msg.receiver === auth.phone && msg.sender === phone) ||
            (msg.sender === auth.phone && msg.receiver === phone));
        
        setFiltered(filteredMsg);        
        
        filteredMsg.forEach(msg => {
            if(msg.receiver === auth.phone && !msg.read) {
                socket.emit("read", msg);  
            }
        });
    }, [Messages, phone, socket, auth.phone]);    
    
    return filtered;
}

function useOverlayHandler() {
    const [activeMessageId, setActiveMessageId] = React.useState(null);
    const navigate = ReactRouterDOM.useNavigate();
    const location = ReactRouterDOM.useLocation();

    React.useEffect(() => {
        const handlePopState = () => {
            if (location.state && location.state.overlayMessageId) {
                setActiveMessageId(null);
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [location.state]);
    
    const openOptions = (messageId) => {
        setActiveMessageId(messageId);
        navigate(location.pathname, {
            state: { ...location.state, overlayMessageId: messageId },
            replace: false
        });
    };
    
    const closeOptions = () => {
        setActiveMessageId(null);
        navigate(-1);
    };
    
    return { activeMessageId, openOptions, closeOptions };
}

function Replies({ phone }) {
    const filteredMessages = useFilterMessages(phone);
    const { activeMessageId, openOptions, closeOptions } = useOverlayHandler();
    
    const activeMessage = filteredMessages.find(msg => msg.id === activeMessageId);
      
    if(!filteredMessages.length) {
        return(<p>Say Hi...</p>);      
    }
  
    return(
        <div className="chat-container">
            {filteredMessages.map((msg, i) => (
                <Reply key={msg.id} msg={msg} onHold={() => openOptions(msg.id)} />   
            ))}   
            
            {activeMessage && (
                <Options
                    msg={activeMessage}
                    onClose={closeOptions}
                />         
            )}
        </div>
    )    
}
