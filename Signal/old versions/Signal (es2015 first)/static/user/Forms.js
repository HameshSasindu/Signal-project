import LoginForm from './Login.js';
import RegisterForm from './Join.js';
import { useState, useEffect } from "react";

export default function Forms({ prop }) {
    const [page, setPage] = React.useState(prop);
       
    return(
        <div className="form">
            {page === "login" && <LoginForm/>}
            {page === "register" && <RegisterForm/>}
            
            <a onClick={() => setPage(page === "login" ? "register" : "login")}> {page === "login" ? "Register" : "Login"} </a>   
        </div>          
    )
       
}