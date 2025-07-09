import { useContext, useEffect } from 'react';
import { useAuth } from '@hooks/auth.hook';
import { Socket } from '@common-utils';

export function useFilterMessages(phone: string) {
    const socket = useContext(Socket);
    const { userInfo: User } = useAuth();
    
    const Messages = useSelector((state) => state.messages.messages);
    const [filtered, setFiltered] = useState([]);
        
    useEffect(() => {
        const filteredMsg = Messages.filter((msg) => 
            (msg.receiver === User.phone && msg.sender === phone) ||
            (msg.sender === User.phone && msg.receiver === phone));
        
        setFiltered(filteredMsg);        
        
        filteredMsg.forEach(msg => {
            if(msg.receiver === User.phone && !msg.read) {
                socket.emit("reading", msg);  
            }
        });
    }, [Messages, phone, socket, User.phone]);    
    
    return filtered;
}
