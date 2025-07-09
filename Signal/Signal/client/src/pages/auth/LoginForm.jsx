import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormInput } from '@components/ui';
import { useDispatch } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export default function LoginForm() {
    const [credentials, setCredentials] = useState({
        phone: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
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
    
    const { mutate, isLoading, data, error: fE, reset } = useMutation({
        mutationFn: async () => {
            const res = await axios.post("/auth/login", credentials ,{ withCredentials: true });
            return res.data;
        },
        onSuccess: (data) => {
             if(data && data.isAuthenticated) {
                alert('Login successful !');
                navigate("/");
             }
        },
        onError: (Error) => {
            if([400,401,404].includes(Error.status)) {
               setError(Error.response?.data?.error);  
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
