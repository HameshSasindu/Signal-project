import { useState } from "react";
import { Icon } from "./common";


function DesktopHomeScreen() {
    const [showProfile, setShowProfile] = React.useState(false);
    
    return(
      <>
        <div className="lander">
            <img src="static/logo.png" />
            <button className='profile' onClick={() => setShowProfile(true)}>
                <Icon name={"person-circle-outline"} />
            </button>
        </div>
        <div className="dt-home"> 
            <div className="dt-left">
                <ChatItem />
                <AddButton/>
            </div>
            <div className="dt-right">
                <ReactRouterDOM.Outlet />
            </div>
            {showProfile &&
                <>
                    <button onClick={() => setShowProfile(false)} className="close account"><Icon name={"close"}/></button>
                    <AccountCard/>
                </> 
            }
        </div>
      </>
    );        
}
