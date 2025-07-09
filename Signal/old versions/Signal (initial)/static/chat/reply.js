function formatTime(iso) {
    const date = new Date(iso);
    return new Intl.DateTimeFormat(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }).format(date);
}

function OptionList({ msg }) {
    const socket = React.useContext(Socket);
    const deleteMsg = () => {
        socket.emit("delete_message", msg);   
    };
    
    return(
        <div className="option-con">
            <div className="msg-con">
                <Reply msg={msg} />
            </div>
            <div className="optionList">
                <div className="option" onClick={deleteMsg}>
                    <Icon name="trash" />
                    <p>Delete Message</p>
                </div>
                <div className="option">
                    <Icon name={"trash"} />
                    <p>Edit Message</p>
                </div>
                
            </div>
        </div>
    )    
}

function Reply({ msg }) {
    const sender = React.useContext(UserContext);
    const ownMsg = (msg.sender === sender.phone);    
    const socket = React.useContext(Socket);
    const [showOptions, setShowOptions] = React.useState(false);
    const holdTimeout = React.useRef(null);
    
    const handleTouchStart = () => {
        holdTimeout.current = setTimeout(() => {
          setShowOptions(true);
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
   
    return(                      
        <div className={`reply relative ${ownMsg ? "own" : ""}`}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchCancel}
        >
            <span className="msg-text">{msg.message}
                <span className="time">{formatTime(msg.timestamp)}</span>
                {ownMsg && <small className="status read">{msg.delivered ? "Delivered": "----"} {msg.read && "Read"}</small> }
            </span> 
            {showOptions && <OptionList msg={msg} />}
        </div>        
    );
}



function Replies({ messages }) {
    if(!messages) {
        return(<p>Start messaging...</p>);      
    }
  
    return(
        <div className="chat-container">
            {messages.map((msg, i) => (
                <Reply key={msg.id} msg={msg} />   
            ))}
        </div>
    )    
}

