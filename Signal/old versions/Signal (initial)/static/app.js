function AddButton() {
    const navigate = ReactRouterDOM.useNavigate();
    return(
        <button className="adder" onClick={() => navigate('/users')}>+</button>  
    );  
}

const router = ReactRouterDOM.createBrowserRouter([
    {
        path: "/",
        element:  <ChatList />
    },
    {
        path: "/login",
        element: <Forms prop={"login"}/> 
    },
    {
        path: "/register",
        element: <Forms prop={"register"} /> 
    },
    {
        path: '/users',
        element: <UserList />
    },
    {
        path: '/chat/:phone',
        element: <ChatScreen />
    },
    {
        path: "*",
        element: <Error404 />
    }
]);

function Main() {
    const [userInfo, setUserInfo] = React.useState({name:'',phone:''});
    const [loggedIn, setLoggedIn] = React.useState(false);
    const [onlineUsers, setOnlineUsers] = React.useState(null); 
    const [load, setLoad] = React.useState(true);
    const [socket, setSocket] = React.useState(null);        
    const [selected, setSelected] = React.useState(null);
    const [allMessages, setAllMessages] = React.useState([]);
    
    React.useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get("/user/info",{withCredentials: true});
            if(res.status === 200) {
                if(res && res.data) {
                    setUserInfo({
                        name: res.data.username,
                        phone: res.data.phone
                    });
                    setLoggedIn(true);   
                }   
            } else {
                console.error(str(res));
            }            
        }    
        fetchUser();
    }, []);
    
    
    React.useEffect(() => {
        if(loggedIn && userInfo.phone) {
            const newSocket = io('http://127.0.0.1:5000', {
            	transports: ['websocket'],
            	upgrade: false
            });            
            const loadOnlines = (users) => setOnlineUsers(users);
            
            newSocket.on('connect', () => {
                setSocket(newSocket);
                newSocket.emit("online", { phone: userInfo.phone });
            });     
            newSocket.on('connect_failed', () => {
                console.error("Socket connection failed");
            });

            newSocket.on('disconnect', () => {
                console.log("socket disconnected.");
            });
            
            newSocket.on('online_users', loadOnlines);
            
            newSocket.emit("all_messages", userInfo.phone);   
            newSocket.on("all_messages", (data) => {
                setAllMessages(data);
                setLoad(false);
            });

            return () => {
                if (newSocket) newSocket.disconnect();
                newSocket.off('online_users', loadOnlines);
                newSocket.off("all_messages");
            }; 
        }   
    }, [loggedIn, userInfo.phone]);
    
    React.useEffect(() => {
        
    }, [socket]);
   
    
    if(!loggedIn) return (<Forms prop={"login"}/>);
    if (load && loggedIn) return(<Loader/>);       
    if (!onlineUsers) return(<Loader/>);  
    
    return(
        <UserContext.Provider value={userInfo}>
            <Socket.Provider value={socket}>
                <SelectedUser.Provider value={{selected, setSelected}}>
                    <OnlineUsers.Provider value={onlineUsers}>
                        <AllMessages.Provider value={{allMessages, setAllMessages}}>
                            <ReactRouterDOM.RouterProvider router={router}/>
                        </AllMessages.Provider>
                    </OnlineUsers.Provider>
                </SelectedUser.Provider>       
            </Socket.Provider>
        </UserContext.Provider>
    );
}




const r = document.getElementById('root');
const root = ReactDOM.createRoot(r).render(<Main/>);


