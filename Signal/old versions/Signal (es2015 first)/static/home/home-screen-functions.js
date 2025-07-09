import { useSelector, useDispatch, Provider } from "react-redux";
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Socket, Loader } from "./common.js";
import { orderLatestMessages } from "./chat-func.js";
import ListItem from "./ListItem.js";

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

export function ChatItem() {
   const socket = useContext(Socket);
   
   const userData = useSelector((state) => state.messages.userData);
   const messages = useSelector((state) => state.messages.messages);
   
   const [latest, setLatest] = useState([]);
   const [loading, setLoading] = useState(true);
    
   useEffect(() => {
       if(messages.length > 0){
           const ordered = orderLatestMessages(messages, userData.phone);
           setLatest(ordered);
       } 
       setLoading(false);
   }, [messages, userData.phone]);
    
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

