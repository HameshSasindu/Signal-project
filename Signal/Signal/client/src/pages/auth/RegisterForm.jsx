import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormInput } from '@components/ui';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export default function RegisterForm() {    
    const [credentials, setCredentials] = useState({
        phone: "",
        password: "",
        name: ""
    });    
    const [error, setError] = useState(null);
    const navigate = useNavigate();
            
    const { mutate, isLoading, data, error: fE, reset } = useMutation({
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