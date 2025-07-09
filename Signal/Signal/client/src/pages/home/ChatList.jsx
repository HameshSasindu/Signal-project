import { useAuth } from '@hooks/auth';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader } from '@globals';
import ChatListItem from './ChatListItem';
import { useLatestMessages } from './hooks';
import { useAllMessages } from '@hooks/messages';

export function UserList() {
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

export default function ChatList() {
   const auth = useAuth();   
   const messages = useAllMessages();
   
   const [latest, setLatest] = useState([]);
   const [loading, setLoading] = useState(true);
    
   useEffect(() => {
       if(messages.length > 0) setLatest(useLatestMessages(messages, auth.phone)); 
       setLoading(false);
   }, [messages, auth.phone]);
    
   if(loading) return(<Loader />);
   if(!latest.length) return <p>Start messaging</p>;
  
   return (
       <div className="chat-list">    
           {latest.map((last, i) => (
               <ChatListItem key={last.id} msg={last} />
           ))}
       </div> 
    );     
}

