function HomeScreenLander() {
    const [showProfile, setShowProfile] = React.useState(false);
    
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

function HomeScreen() {
    return(
        <div>
            <HomeScreenLander />
            <ChatItem />
            <AddButton/>
        </div>
    );    
}

function DesktopHomeScreen() {    
    return(<>
        <div className="dt-home"> 
            <div className="dt-left">
                <HomeScreenLander />      
                <ChatItem />                
                <AddButton/>
            </div>
            <div className="dt-right">
                <ReactRouterDOM.Outlet />
            </div>
    
        </div>
    </>);        
}
