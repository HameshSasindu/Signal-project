function LoginForm() {
    const [credentials, setCredentials] = React.useState({
        phone: '',
        password: ''
    });
    const [error, setError] = React.useState('');
        
    const data = {
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
    };
   const save = localStorage.setItem;
   const login = async () => {
       setError("");
       try {
           const response = await axios.post("/login/user", {
               credentials
           }, { withCredentials: true });     
           
           if (response.data) {
               window.location.reload();
           }
       } catch (error) {
           if([400,401,404].includes(error.status)) {
               setError(error.response.data.error);  
           }
       }
    }
    
    return(
        <>
            <h1>Welcome Back! </h1>
            <FormInput props={{...data.phone, setCredentials}}/>
            <div>                        
               <FormInput props={{...data.password, setCredentials}}/> 
               {error && <p className="error">{error}</p>} 
            </div>
            <button onClick={login}>Login</button> 
        </>   
    );
}
