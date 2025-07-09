function useLastSeen(phone) {
    const onlineUsers = ReactRedux.useSelector((state) => state.onlineUsers);
    const [check, setCheck] = React.useState(false);
    
    const [lastSeen, setLastSeen] = React.useState(null);    
    const [online, setOnline] = React.useState(false);
    
    React.useEffect(() => {
        if (Object.values(onlineUsers).includes(phone)) {
            setOnline(true);    
            setCheck(false);
        } else {
            setCheck(true);
            setOnline(false);
        }
    }, [onlineUsers]);
    
    const { isLoading, data, error } = ReactQuery.useQuery({
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
    
    return {
        lastSeen: lastSeen,
        online: online
    }
}


function StatusOfUser({ phone, typing }) {
    const { lastSeen, online } = useLastSeen(phone);
    
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

function ContactBar({ phone, typing }) {
    const back = () => history.back();
    const auth = useAuth();
          
    return(
        <div className="topBar">
            <button onClick={back}><Icon name={"chevron-back"}/></button>
            <div className="">
                <b>{phone} {auth.phone === phone ? "(You)":""}</b>
                <StatusOfUser phone={phone} typing={typing} />
            </div> 
        </div>
    );    
}
