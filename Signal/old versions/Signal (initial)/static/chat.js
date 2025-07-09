function ChatItem({ onlineUsers }) {
   const userData = React.useContext(UserContext);
   const socket = React.useContext(Socket);
   
   const [messages, setMessages] = React.useState([]);
   const [latest, setLatest] = React.useState([]);
   const [loading, setLoading] = React.useState(true);
   
   const contact = (msg) => {
       const isCurrentUserSender = msg.sender === userData.phone;
       return isCurrentUserSender ? msg.receiver : msg.sender;       
   }
     
   React.useEffect(() => {
       if (socket) {   
           socket.emit('load_messages', {sender: userData.phone});
           socket.on('load_messages', (data) => setMessages(data));
        
           return () => socket.off("load_messages");
       }                  
   }, [socket]);
    
   React.useEffect(() => {
       if(messages.length > 0) setLatest(getLatestMessagesOrdered(messages, userData.phone)); 
       setLoading(false);
   }, [messages]);
    
   if(loading) return(<Loader />);
   if(latest.length === 0) return <p>Start messaging</p>;
   
   return (
       <div className="chat-list">    
           {latest.map((last, i) => (
               <ListItem key={i} msg={last} />
           ))}
       </div> 
    );     
}

function ListItem({ msg }) {
    const userData = React.useContext(UserContext);
    const isCurrentUserSender = msg.sender === userData.phone;
    const contact = isCurrentUserSender ? msg.receiver : msg.sender;
    const you = (msg.sender === userData.phone && msg.receiver === userData.phone ? "(You)" : "");    
    
    const navigate = ReactRouterDOM.useNavigate();
    
    const handleChat = (phone) => {
        navigate(`/chat/${phone}`);    
    }
    
    return(
        <div className="chat" onClick={() => handleChat(contact)}>
            <div className="names">
                <img src="https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg" />
                <div className="name">
                    <b>{contact} {you}</b>  
                    <small>{msg.message}</small>     
                </div>        
            </div>
            <div className="meta">
                <small>{getRelativeTime(msg.timestamp)}</small>  
                <span>0</span>
            </div>
        </div>        
    )    
}


function ChatList() {
    const socket = React.useContext(Socket);
    const userData = React.useContext(UserContext);
    const {selected, setSelected} = React.useContext(SelectedUser);
    const onlineUsers = React.useContext(OnlineUsers);
    const [myMessages, setMyMessages] = React.useState([]);
        
    React.useEffect(() => {
        myMessages.forEach(msg => {
            if(!msg.delivered) {
                socket.emit("delivering", msg);    
            }    
        });  
    }, [myMessages]);
    
    if(!onlineUsers) return (<p>No online users !</p>);  
      
    return(
        <>
            <div className="lander">
                <img src="static/logo.png" />
            </div>
            <ChatItem onlineUsers={onlineUsers} />
            <AddButton/>
        </>
    );    
}


function UserList() {
    const userData = React.useContext(UserContext);
    const [users, setUsers] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const navigate = ReactRouterDOM.useNavigate();
    
    React.useEffect(() => { 
        const fetchUser = async () => {
            try{
                const res = await axios.get("/api/users");
                if (res && res.data) setUsers(res.data);
                setLoading(false);
            } catch(error) {
                console.error(error);
            }
        }
        fetchUser();
    }, []);
    
    const handleClick = (phone) => {
        navigate(`/chat/${phone}`);     
    }
    
    if(loading) return (<Loader />);
    
    return(
        <div className="userlist">
            {users.map((user, i) => (
                <div key={user.phone} onClick={() => handleClick(user.phone)}>
                    <b>{user.name} • </b>
                    <small>{user.phone}</small> 
                </div>
            ))}
        </div>   
    );
}


