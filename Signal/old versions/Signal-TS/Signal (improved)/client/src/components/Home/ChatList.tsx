import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { orderLatestMessages, getRelativeTime, formatLastSeen } from "./hooks";
import { Icon, Socket } from "@common-utils";
import ChatListItem from "./ChatListItem";

export function UserList() {
    const userData = useSelector((state) => state.messages.userData);
    
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    
    useEffect(() => { 
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
    
    const handleClick = (phone) => navigate(`/chat/${phone}`);
    
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

export function useLatestMessages() {
   const { userInfo: userData } = useAuth();
   const messages = useSelector((state) => state.messages.messages);
   
   const [latest, setLatest] = useState([]);
   const [loading, setLoading] = useState(true);
    
   useEffect(() => {
       if(messages.length > 0) setLatest(orderLatestMessages(messages, userData.phone)); 
       setLoading(false);
   }, [messages, userData.phone]);
   
   return {
       isLoading: loading,
       latestMessages: latest
   }       
}

export default function ChatItem() {
   const {isLoading, latestMessages} = useLatestMessages();
    
   if(isLoading) return(<Loader />);
   if(!latestMessages.length) return <p>Start messaging</p>;
  
   return (
       <div className="chat-list">    
           {latestMessages.map((last, i) => (
               <ChatListItem key={last.id} msg={last} />
           ))}
       </div> 
    );     
}

