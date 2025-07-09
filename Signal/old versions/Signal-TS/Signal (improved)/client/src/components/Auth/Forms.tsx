import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '@hooks/auth.hook';
import LoginForm from "./Login.jsx";
import RegisterForm from './Join.jsx';
import { FormInputProps, FormsProps } from '@types/forms';

export function FormInput({ props } : FormInputProps) {
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

export default function Forms({ section='login' } : FormsProps) {
    const [page, setPage] = useState(section);
    const { loggedIn } = useAuth();
    const navigate = useNavigate();
    
    useEffect(() => {
        if (loggedIn) navigate("/", { replace: true });
    }, [loggedIn]);

    const handleChange = () => {
        navigate(page === "login" ? "/register" : "/login");
        setPage(page === "login" ? "register" : "login");
    }
    return(
        <form className="form">
            {page === "login" ? 
                (<LoginForm/>) :
            page === "register" ?
                (<RegisterForm/>)
            : null }
            
            <a onClick={handleChange}> {page === "login" ? "Register" : "Login"} </a>   
        </form>          
    )
       
}
