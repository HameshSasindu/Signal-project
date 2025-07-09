import { createSlice } from "@reduxjs/toolkit";

const MessagesSlice = createSlice({
    name: "allMessages",
    initialState: {
        messages: [],
        userData: {name: "", phone: "", bio: ""},
        loggedIn: false,
        newMessages: []
    },
    reducers: {
        updateUser: (state, action) => {
            state.userData = action.payload;
        },
        updateLogin: (state) => {
            state.loggedIn = !state.LoggedIn;
        },
        loadMessages: (state, action) => {
            state.messages = action.payload;
        },
        update: (state, action) => {
            state.messages = [...state.messages, action.payload];
        },
        deleteMessage: (state, action) => {
            state.messages = state.messages.filter((msg) => msg.id !== action.payload);
        },
        setDelivered: (state, action) => {
            state.messages = state.messages.map(msg => 
                msg.id === action.payload.id ? {...msg, delivered: action.payload.delivered} : msg);
        },
        setRead: (state, action) => {
            state.messages = state.messages.map(msg => 
                msg.id === action.payload.id ? {...msg, read: action.payload.read} : msg)
        },
        
    }    
});

export const { updateUser,updateLogin, loadMessages, update, deleteMessage, setDelivered, setRead } = MessagesSlice.actions;
export default MessagesSlice.reducer;