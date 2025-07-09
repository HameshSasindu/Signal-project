import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/auth';

import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export default function Forms({ prop }) {
    const [page, setPage] = useState(prop);
    const auth = useAuth();
    const navigate = useNavigate();
    
    useEffect(() => {
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
