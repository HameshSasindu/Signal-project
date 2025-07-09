function AccountCard() {
    const userInfo = ReactRedux.useSelector((state) => state.messages.userData);
    
    const logout = () => {
        axios.get("/logout");
        window.location.reload();
    }
    
    const close = () => {
        
    }
    
    return(
        <div className="ac-bg">
         <div className="account-card">
            <div className="pfp">
                <div className="relative">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg" alt=""/>  
                    <span className="dotOn"></span>
                </div>
            </div>
            <div className="meta">
                <h2>{userInfo.name}</h2>
                <p>{userInfo.phone.split(" ").join("-")}</p>
                <small>{userInfo.bio}</small>
            </div>
            
            <div className="Ops">
                <div className="Op">
                    <Icon name={"settings-outline"} />
                    <p>Settings</p>
                </div>
            </div>
            
            <div className="logout" onClick={logout}>
                Logout
            </div>
        </div>
       </div>
    )
}