import { useState, useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import { Socket } from "@common-utils";
import { useAuth } from '@hooks/auth.hook';
import { ChatScreenItems} from "@types/global";

export function useLastSeen(phone: string) {
    const onlineUsers = useSelector((state) => state.onlineUsers.onlineUsers);
    const [check, setCheck] = useState(false);
    
    const [lastSeen, setLastSeen] = useState(null);    
    const [online, setOnline] = useState(false);
    
    useEffect(() => {
        if (Object.values(onlineUsers).includes(phone)) {
            setOnline(true);    
            setCheck(false);
        } else {
            setCheck(true);
            setOnline(false);
        }
    }, [onlineUsers]);
    
    const { isLoading, data, error } = useQuery({
        queryKey: ['lastseen', phone],
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
    
    return {
        lastSeen: lastSeen,
        online: online
    }
}


function StatusOfUser({ phone } : ChatScreenItems ) {
    const { lastSeen, online } = useLastSeen(phone);
    const [typing, setTyping] = useState(false);
    
    useEffect(() => {
        socket.on('typing', (data) => {
            if(data.receiver === User.phone && data.sender !== User.phone) {
                setTyping(true);
            }
        });
        
        socket.on('stop_typing', (data) => {            
            setTyping(false); 
        });
                
        return () => {
            socket.off('typing');
            socket.off('stop_typing');
        }        
    }, [receiver]);
    
    const Typing = () => {return(<p className="typing">Typing...</p>)};
    const Online = () => {return(<p className="online">Online</p>)};
    const LastSeen = () => {return(<p className="online">{formatLastSeen(lastSeen)}</p>)};  
    
    return(
        <>
            {
                typing ? (<Typing/>) :
                online ? (<Online/>) :
                lastSeen ? (<LastSeen/>) : null
            }
        </>   
    )      
}

export default function ContactBar({ phone }:{phone:string}) {
    const back = () => history.back();
    const { userInfo: userData } = useAuth();
          
    return(
        <div className="topBar">
            <button onClick={back}><Icon name={"arrow-back"}/></button>
            <div className="">
                <p>{phone} {userData.phone === phone ? "(You)":""}</p>
                <StatusOfUser phone={phone} />
            </div> 
        </div>
    );    
}
