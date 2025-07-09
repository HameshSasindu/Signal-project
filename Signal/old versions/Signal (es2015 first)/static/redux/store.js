import { configureStore } from "@reduxjs/toolkit";
import messagesReducer from "./MessagesSlice.js";
import onlineReducer from "./OnlineSlice.js";
import settingsReducer from "./SettingsSlice.js";

const store = configureStore({
    reducer: {
         messages: messagesReducer,
         onlineUsers: onlineReducer,
         settings: settingsReducer
    }
});

export default store;
