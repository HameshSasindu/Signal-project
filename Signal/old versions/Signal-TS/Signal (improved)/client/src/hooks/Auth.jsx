import { useSelector, useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";

export function useAuth() {
    const loggedIn = useSelector((state) => state.messages.loggedIn);
    const userInfo = useSelector((state) => state.messages.userData);
    
    return {
        loggedIn: loggedIn,
        userInfo: userInfo
    };
}

function useAuthenticate() {
    const dispatch = useDispatch();
    const { loggedIn } = useAuth();
    
    const authentication = useQuery({
        queryKey: ['authenticate'],
        queryFn: async () => {
            const res = await axios.get("/auth/authenticate", {
                withCredentials: true
            });
            return res.data;
         },
         onSuccess: (data) => {
            if(data && data.loggedIn) {
                dispatch(MessagesSlice.actions.updateUser({
                    name: data.username,
                    phone: data.phone,
                    bio: data.bio
                }));                   
                dispatch(MessagesSlice.actions.updateLogin());
            }
        },
        refetchOnWindowFocus: false,
        enabled: !loggedIn
    });            
    
    return {
        isLoading: authentication.isLoading,
        error: authentication.error
    }
}

export default useAuthentication;
