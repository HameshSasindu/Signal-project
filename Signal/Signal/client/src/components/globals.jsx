import { createPortal } from 'react-dom/client';
import { useNavigate } from 'react-router-dom';
import { Ring2 } from 'ldrs/react'
import 'ldrs/react/Ring2.css'

export function Loader() {
    return(
        <div className="lbg">
            <Ring2 size="35" stroke="5" stroke-length="0.25" bg-opacity="0.1" speed="0.8" color="black" />
        </div>
    );
}

export function InitialLoader() {
    return (
        <div className="initial-loader">
            <img src="/src/logo.png" />   
        </div>
    );    
}

export function Icon({ name }) {
    return(
         <svg className="ion-icon" width="20" height="20">
             <use href={`#${name}`}></use>
         </svg>
    );
}

export function Error404({ error="Couldn't find for page you're looking for!" }) {
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

export function RenderPortal({ children, onClose }) {
    const portalRoot = document.getElementById('modal-root');
    
    const handleContentClick = (e) => {
        e.stopPropagation();
    };
    
    return createPortal(
        <div className="portal-bg" onClick={onClose}>
            <div className="portal-content" onClick={handleContentClick}>
                 { children }  
            </div>
        </div>,
        portalRoot
    );
}

export function AddButton() {
    const navigate = useNavigate();
    return(
        <button className="adder" onClick={() => navigate('/users')}>
            <Icon name={"add"} />
        </button>  
    );  
}
