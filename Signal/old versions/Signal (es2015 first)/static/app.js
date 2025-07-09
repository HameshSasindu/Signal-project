import { useState, useContext, useEffect } from "react";
import { useSelector, useDispatch, Provider } from "react-redux";
import { useNavigate, createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, useQuery, QueryClientProvider } from "react-query";
import SetupSocket from "/socket.js";
import { loadMessages, updateLogin, updateUser } from "./store/MessagesSlice.js";
import { loadOnlinea } from "./store/OnlinesSlice.js";
import { Loader } from "./common.js";
import { HomeScreen, DesktopHomeScreen } from "./home/HomeScreen.js";

const Forms = React.lazy(() => {
    import Forms from "./forms";
});

const mobileRouter = [
    {
       path: "/",
       element: <HomeScreen /> 
    },
    {
        path: '/users',
        element: <UserList />
    },
    {
        path: '/chat/:phone',
        element: <ChatScreen />
    }
];

const desktopRouter = [
    {
        path: "/",
        element: <DesktopHomeScreen />,
        children: [
            {
                index: true,
                element: <div>Select a chat.</div>
            },
            {
                path: "/chat/:phone",
                element: <ChatScreen />
            },
            {
                path: '/users',
                element: <UserList />
            }
        ]
    }
];


const queryClient = new QueryClient();
 
function App() {    
    const dispatch = useDispatch();
    const loggedIn = useSelector((state) => state.messages.loggedIn);
    const userInfo = useSelector((state) => state.messages.userData);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
    
    const socket = SetupSocket();

    const selectedRouter = isDesktop ? desktopRouter : mobileRouter;

    const { isLoading, data, error } = useQuery({
        queryKey: ['messages'],
        queryFn: async () => {
            try {
                const res = await axios.get("/api/all-messages");
                dispatch(loadMessages(res.data));
            } catch(error) {
                throw new error(error);
            }
        },
        enabled: loggedIn
    });
    
    const { isLoading:ml, data:md, error:me } = useQuery({
        queryKey: ['onlineUsers'],
        queryFn: async () => {
            try {
                const res = await axios.get("/api/all-online");
                dispatch(loadOnlines(res.data));
                log(res.data);
            } catch(error) {
                throw new error(error);
            }
        },
        enabled: loggedIn
    });    
    
    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get("/user/info", {
                withCredentials: true
            });
            if(res.status === 200) {
                if(res && res.data) {
                    dispatch(updateUser({
                        name: res.data.username,
                        phone: res.data.phone,
                        bio: res.data.bio
                    }));                   
                    dispatch(updateLogin());
                }   
            } else {
                console.error(str(res));
            }            
        }    
        fetchUser();        
    }, []);
    
    const messages = useSelector((state) => state.messages.messages);
        
    useEffect(() => {
        messages.forEach(msg => {
            if(socket && msg.receiver === userInfo.phone && !msg.delivered) {
                socket.emit("deliver", msg);    
            }    
        });                 
    }, [userInfo.phone, messages, socket]);
    
    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 768);        
        window.addEventListener('resize', handleResize);        
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    const router = createBrowserRouter([
        ...selectedRouter,
        {
            path: "/login",
            element: <Forms prop={"login"}/> 
        },
        {
            path: "/register",
            element: <Forms prop={"register"} /> 
        },
        {
            path: "/settings",
            element: <Settings />
        },
        {
            path: "*",
            element: <Error404 />
        }
    ]);
    
    if(!loggedIn) return (<Forms prop={"login"}/>);
    if (isLoading && loggedIn) return(<Loader/>);       
   
    return(
        <Socket.Provider value={socket}>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router}/>
            </QueryClientProvider>
        </Socket.Provider>
    );
}

export default App;
