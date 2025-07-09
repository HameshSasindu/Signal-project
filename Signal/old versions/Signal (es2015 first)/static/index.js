import React from "react";
import { Provider } from "react-redux";
import App from "./App";
import store from "./redux/store.js";

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Provider store={store}>        
            <App/>                
        </Provider>
    </React.StrictMode>
);