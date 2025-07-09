import { configureStore } from "@reduxjs/toolkit";
import MessageSlicer from "@redux/MessageSlice";
import SettingSlicer from "@redux/SettingSlice";
import OnlineSlicer from "@redux/OnlineSlice";

const store = configureStore({
    reducer: {
         messages: MessageSlicer,
         onlineUsers: OnlineSlicer,
         settings: SettingSlicer
    }
});

export default store;
