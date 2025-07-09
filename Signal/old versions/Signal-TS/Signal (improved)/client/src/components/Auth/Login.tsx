import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { useAuth } from '@hooks/auth.hook.js';
import { FormInput } from "./Forms.jsx";
import axios from "axios";

export default function LoginForm() {
    const [credentials, setCredentials] = useState({
        phone: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();
        
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
    
    const { mutate, isLoading, data, error: formError, reset } = useMutation({
        mutationFn: async () => {
            const res = await axios.post("/auth/login", credentials);
            return res.data;
        },
        onSuccess: (data) => {
            alert('Login successful !');
            reset();
            navigate("/");
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
