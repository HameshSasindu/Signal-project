import { useState, useContext, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useQuery } from "react-query";
import { Socket } from "./../common.js";
import { formatLastSeen } from "./../Home/chat-func.js";

export default function ContactBar({ phone, typing }) {
    const back = () => history.back();
    
    const userData = useSelector((state) => state.messages.userData);
    const onlineUsers = useSelector((state) => state.onlineUsers.onlineUsers);
    const [lastSeen, setLastSeen] = useState(null);
    
    const [online, setOnline] = useState(false);
    const [check, setCheck] = useState(false);
    
    const { isLoading, data, error } = useQuery({
        queryKey: ['lastseen'],
        queryFn: async () => {
            try {
                const res = await axios.get(`/api/online/${phone}`);
                if (res.data.time) setLastSeen(res.data.time);
            } catch(error) {
                throw new error(error);
            }
        },
        enabled: check
    });
    
    useEffect(() => {
        if (Object.values(onlineUsers).includes(phone)) {
            setOnline(true);    
            setCheck(false);
        } else {
            setCheck(true);
            setOnline(false);
        }
    }, [onlineUsers]);
    
    const Typing = () => {return(<p className="typing">Typing...</p>)};
    const Online = () => {return(<p className="online">Online</p>)};
    const LastSeen = () => {return(<p className="online">{formatLastSeen(lastSeen)}</p>)};
    
    return(
        <div className="topBar">
            <button onClick={back}><Icon name={"arrow-back"}/></button>
            <div className="">
                <p>{phone} {userData.phone === phone ? "(You)":""}</p>
                { typing ? (<Typing/>) :
                  online ? (<Online/>) :
                  lastSeen ? (<LastSeen/>) : null }
            </div> 
        </div>
    );    
}