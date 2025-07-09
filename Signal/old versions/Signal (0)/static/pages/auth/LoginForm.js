function LoginForm() {
    const [credentials, setCredentials] = React.useState({
        phone: '',
        password: ''
    });
    const [error, setError] = React.useState('');
    const navigate = ReactRouterDOM.useNavigate();
    const dispatch = ReactRedux.useDispatch();
    
    const input = {
        'phone': {
             type: "number",
             name: "phone",
             ph: "Phone",
             icon: "call-outline"
        },
       'password': {
             type: "password",
             name: "password",
             ph: "Password",
             icon: "lock-closed-outline"
        }
    }
    
    const { mutate, isLoading, data, error: formError, reset } = ReactQuery.useMutation({
        mutationFn: async () => {
            const res = await axios.post("/auth/login", credentials);
            return res.data;
        },
        onSuccess: (data) => {
             if(data && data.isAuthenticated) 
                alert('Login successful !');
                navigate("/");
             }
        },
        onError: (Error) => {
            if([400,401,404].includes(Error.status)) {
               setError(Error.response.data.error);  
            }
        }
    });
    
    
    const login = (event) => {
        event.preventDefault();
        mutate();
    };
    
    return(
        <>
            <h1>Welcome Back! </h1>
            <FormInput props={{...input.phone, setCredentials, auto: "username"}}/>                       
            <FormInput props={{...input.password, setCredentials, auto: "current-password"}}/> 
            {error && <p className="error">{error}</p>} 
            <button type="submit" onClick={login} disabled={isLoading}>Login</button> 
        </>   
    );
}
