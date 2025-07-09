import { Icon } from '@globals';

export function Button({ text, onClick, className, isDisabled=false }) {
    return (<button
        onClick={onClick}
        className={className}
        disabled={isDisabled}>
        {text}
    </button>); 
}

export function FormInput({ props }) {
    const { type, name, ph, icon, setCredentials, auto } = props;
    
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
               autoComplete={auto}
           />  
           <Icon name={icon} />
        </div>
    )   
}