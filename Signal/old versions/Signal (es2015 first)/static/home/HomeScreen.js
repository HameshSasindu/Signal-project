import { useState } from "react";
import { Icon } from "./../common.js";
import { AddButton } from "./ListItem.js";
import { ChatItem } from "./home-screen-functions.js";

function HomeScreen() {
    const [showProfile, setShowProfile] = useState(false);
    
    return(
        <> 
            <div>
                <div className="lander">
                    <img src="static/logo.png" />
                    <button className='profile' onClick={() => setShowProfile(true)}>
                        <Icon name={"person-circle-outline"} />
                    </button>
                </div>
                <ChatItem />
                <AddButton/>
            </div>
            {showProfile &&
                <>
                    <button onClick={() => setShowProfile(false)} className="close account"><Icon name={"close"}/></button>
                    <AccountCard/>
                </> 
            }
        </>
    );    
}

