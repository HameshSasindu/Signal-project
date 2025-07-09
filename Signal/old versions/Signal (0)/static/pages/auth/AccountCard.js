function AccountCard() {
    const auth = useAuth();
    const navigate = ReactRouterDOM.useNavigate();
    
    const logout = () => {
        axios.delete("/auth/logout");
        window.location.reload();
    };
    
    return(
        <div className="ac-bg">
         <div className="account-card">
            <div className="pfp">
                <div className="relative">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg" />  
                    <span className="dotOn"></span>
                </div>
            </div>
            <div className="meta">
                <h2>{auth.name}</h2>
                <p>{auth.phone.split(" ").join("-")}</p>
                <small>{auth.bio}</small>
            </div>
            
            <div className="Ops">
                <div className="Op" onClick={() => navigate('/settings')}>
                    <Icon name={"settings-outline"} />
                    <p>Settings</p>
                </div>
            </div>
            
            <div className="logout" onClick={logout}>
                Logout
            </div>
        </div>
       </div>
    );
}
