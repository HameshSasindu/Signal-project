import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Icon, AddButton } from '@globals';
import ChatList from './ChatList';
import { AccountCard } from '@pages/auth/index';

function HomeScreenLander() {
    const [showProfile, setShowProfile] = useState(false);
    
    return (
        <>
            <div className="lander">
                <img src="static/logo.png" />
                <button className='profile' onClick={() => setShowProfile(true)}>
                    <Icon name={"person-circle-outline"} />
                </button>
            </div>
             {showProfile &&
                <>
                    <button onClick={() => setShowProfile(false)} className="close account"><Icon name={"close"}/>close</button>
                    <AccountCard/>
                </> 
            }
        </>
    );
        
}

export default function HomeScreen() {
    return(
        <div>
            <HomeScreenLander />
            <ChatList />
            <AddButton/>
        </div>
    );    
}

export function DesktopHomeScreen() {    
    return(<>
        <div className="dt-home"> 
            <div className="dt-left">
                <HomeScreenLander />      
                <ChatList />                
                <AddButton/>
            </div>
            <div className="dt-right">
                <Outlet />
            </div>    
        </div>
    </>);        
}
