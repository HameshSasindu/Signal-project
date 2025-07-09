import { createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trio } from 'ldrs/react'
import 'ldrs/react/Trio.css'

export const Socket = createContext(null);

export function Icon({ name } : { name: string }) {
    return(
         <svg className="ion-icon" width="20" height="20">
             <use href={`#${name}`}></use>
         </svg>
    );
}

export function Loader() {
    return(
        <div className="lbg">
            <Trio size="40" speed="1.3" color="black"/>
        </div>
    );
}

export function InitialLoader() {
    return (
        <div className="initial-loader">
            <img src="@public/logo.png" />   
        </div>
    );    
}

export function Error404({ error="Couldn't find for page you're looking for!" } : { error: string }) {
    return(
        <div className="error-container">
            <div className="error404">
                <h1>404</h1>
                <small>You know what that means!</small>
            </div>
            {error && <p id="error404p">{error} </p>}
        </div>
    )   
    
}

export function AddButton() {
    const navigate = useNavigate();
    return(
        <button className="adder" onClick={() => navigate('/users')}>+</button>  
    );  
}

export const log = (m: any) => console.log(JSON.stringify(m));
