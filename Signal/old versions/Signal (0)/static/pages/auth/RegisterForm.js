function FormInput({ props }) {
    const {type, name, ph, icon, setCredentials, auto} = props;
    
    const handleInput = (e) => {
        const { value } = e.target;
        setCredentials((prevCredentials) => ({
            ...prevCredentials,
            [name]: value,
        }));
    };
    
    
    return(
        <div className="input-con relative">
           <input
               type={type}
               className={name}
               placeholder={ph}
               onChange={handleInput}
               autoComplete={auto ? auto : null}
           />  
           <Icon name={icon} />
        </div>
    )   
}

function RegisterForm() {    
    const [credentials, setCredentials] = React.useState({
        phone: "",
        password: "",
        name: ""
    });
    
    const [error, setError] = React.useState(null);
            
    const { mutate, isLoading, data, error: formError, reset } = ReactQuery.useMutation({
        mutationFn: async (abc) => {
            const res = await axios.post("/auth/register", credentials);
            return res.data;
        },
        onSuccess: (data) => {
            alert('Registration successful !');
            navigate("/login");
        },
        onError: (Error) => {
            setError(Error.response.data.error);
            if([400,401,404].includes(Error.status)) {
               setError(Error.response.data.error);  
            }
        }
    });
        
    const input = {
            'phone': {
                type: "number",
                name: "phone",
                ph: "+94 7x-xxx-xxx",
                icon: "call-outline"
            },
            'name': {
                type: "text",
                name: "name",
                ph: "Enter your name",
                icon: "person-outline"
            },
            'password': {
                type: "password",
                name: "password",
                ph: "Enter your password",
                icon: "lock-closed-outline"
             }
        };  
    
    const register = (event) => {
        event.preventDefault();
        mutate();
    };  
    
    return(
       <>
           <h1> Connect with everyone </h1>                     
           <FormInput props={{...input['phone'], setCredentials}}/>
           <FormInput props={{...input['name'], setCredentials}}/>    
           <FormInput props={{...input['password'], setCredentials}}/>          
           {error && <p className="error">{error}</p>}
           <button type="submit" onClick={register} disabled={isLoading}>Join</button>
       </>
    );
}


function Forms({ prop }) {
    const [page, setPage] = React.useState(prop);
    const auth = useAuth();
    const navigate = ReactRouterDOM.useNavigate();
    
    React.useEffect(() => {
        if (auth.isAuthenticated) navigate("/", { replace: true });
    }, [auth.isAuthenticated, navigate]);

    const handleChange = () => {
        navigate(page === "login" ? "/register" : "/login");
        setPage(page === "login" ? "register" : "login");
    }
    return(
        <form className="form">
            {page === "login" ? 
                (<LoginForm/>) :
            page === "register" ?
                (<RegisterForm/>) : null }
            
            <a onClick={handleChange}> {page === "login" ? "Register" : "Login"} </a>   
        </form>          
    )
       
}
