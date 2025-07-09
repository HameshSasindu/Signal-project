/*
import { useAuth } from '@hooks/auth';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

*/

function UserList() {
    const auth = useAuth();
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

function ChatList() {
   const socket = useSocket();   
   const auth = useAuth();
   
   const messages = ReactRedux.useSelector((state) => state.messages);
   
   const [latest, setLatest] = React.useState([]);
   const [loading, setLoading] = React.useState(true);
    
   React.useEffect(() => {
       if(messages.length > 0) setLatest(orderLatestMessages(messages, auth.phone)); 
       setLoading(false);
   }, [messages, auth.phone]);
    
   if(loading) return(<Loader />);
   if(!latest.length) return <p>Start messaging</p>;
  
   return (
       <div className="chat-list">    
           {latest.map((last, i) => (
               <ListItem key={last.id} msg={last} />
           ))}
       </div> 
    );     
}

