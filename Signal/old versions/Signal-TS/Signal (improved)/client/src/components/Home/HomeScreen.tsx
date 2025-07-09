import { useState } from "react"; 
import ChatItem from "./ChatItem.tsx";
import AccountCard from '@components/Auth/AccountCard';
import { Icon, AddButton } from "@common-utils";
import { Outlet } from "react-router-dom";


export function Lander() {
    const [showProfile, setShowProfile] = useState(false); 
    
    return (
        <div className="lander">
            <img src="static/logo.png" />
            <button className='profile' onClick={() => setShowProfile(true)}>
                <Icon name={"person-circle-outline"} />
            </button>
            {showProfile &&
                <>
                    <button onClick={() => setShowProfile(false)} className="close account"><Icon name={"close"}/></button>
                    <AccountCard/>
                </> 
            }
        </div>    
    );
}

export default function HomeScreen() {   
    return(
        <> 
            <div>
                <Lander>
                <ChatItem />
                <AddButton/>
            </div>
        </>
    );
}

export function DesktopHomeScreen() {    
    return(
      <>
        <Lander />
        <div className="dt-home"> 
            <div className="dt-left">
                <ChatItem />
                <AddButton/>
            </div>
            <div className="dt-right">
                <Outlet />
            </div>
        </div>
      </>
    );   
}
