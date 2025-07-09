const Socket = React.createContext(null);
const UserContext = React.createContext(null);

const SelectedUser = React.createContext(null);
const OnlineUsers = React.createContext(null);

const AllMessages = React.createContext(null);


function Icon({ name }) {
    return(<ion-icon name={name}></ion-icon>);
}
function Loader() {
    return(
        <div className="lbg"><l-ring-2 size="35" stroke="5" stroke-length="0.25" bg-opacity="0.1" speed="0.8" color="black"q></l-ring-2></div>
    )
}

function Error404({ error="Couldn't find for page you're looking for!" }) {
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

const log = (m) => console.log(JSON.stringify(m));
