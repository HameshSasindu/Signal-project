function FormInput({ props }) {
    const {type, name, ph, icon, setCredentials} = props;
    
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
           />  
           <ion-icon name={icon}></ion-icon>
        </div>
    )   
}

function RegisterForm() {
    const [currentStage, setCurrentStage] = React.useState('phone');  
    
    const [credentials, setCredentials] = React.useState({
        phone: "",
        password: "",
        name: ""
    });
    
    const [error, setError] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    
    const [phoneCheck, setPhoneCheck] = React.useState(false);    
    const [phoneSubmit, setPhoneSubmit] = React.useState(false);
    
    const checkPhone = async () => {
        try{
            const response = await axios.post(`/check_user/${credentials.phone}`);
            if(response && response.data) setPhoneCheck(true);
            setError(null);
            setCurrentStage('name');
        } catch(error) {
            if(error.status === 404) {
                setError(error.response.data.response);
                setPhoneSubmit(false);
            } else {
                setError("An unexpected error occurred.");
                setPhoneSubmit(false);
                setPhoneCheck(false);
            }
        }
        
    };
    
    const register = async () => {
        try {
            const response = axios.post("/create/user", {
                credentials
            });
            if (response && response.data) {
                return (<LoginForm/>);
            };
        } catch (error) {
            console.log(error);
        }
    }
    
    React.useEffect(() => {
        if(phoneSubmit) checkPhone();       
    }, [phoneSubmit]);
        
    const data = {
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
    
    const handlePhone = () => setPhoneSubmit(true);    
    const handleName = () => setCurrentStage('password');
    
    
    return(
       <>
           <h1> Connect with everyone </h1>                     
           { currentStage === "phone" && (
                <div className="phone-con">
                    <FormInput props={{...data['phone'], setCredentials}}/>
                    { error && <p className="error">{error}</p> }
                    <button onClick={handlePhone}>Next</button>
                </div>
           )}              
           { currentStage === "name" && (
               <div className="name-con">
                   <FormInput props={{...data['name'], setCredentials}}/>
                   <button onClick={handleName}>Next</button> 
               </div>
           )}           
           { currentStage === "password" && (
               <div className="pwd-con">
                   <FormInput props={{...data['password'], setCredentials}}/>
                   <button onClick={register}>Join</button>       
               </div>     
           )}
       </>
    );
}


function Forms({ prop }) {
    const [page, setPage] = React.useState(prop);
       
    return(
        <div className="form">
            {page === "login" && <LoginForm/>}
            {page === "register" && <RegisterForm/>}
            
            <a onClick={() => setPage(page === "login" ? "register" : "login")}> {page === "login" ? "Register" : "Login"} </a>   
        </div>          
    )
       
}
