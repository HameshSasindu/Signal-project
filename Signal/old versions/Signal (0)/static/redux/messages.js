import { createSlice } from '@reduxjs/toolkit';

const AllMessages = createSlice({
    name: "allMessages",
    initialState: [],
    reducers: {
        loadMessages: (state, action) => {
            state = action.payload;
        },
        update: (state, action) => {
            state = [...state, action.payload];
        },
        deleteMessage: (state, action) => {
            state = state.filter((msg) => msg.id !== action.payload);
        },
        setDelivered: (state, action) => {
            state = state.map(msg => 
                msg.id === action.payload.id ? {...msg, delivered: action.payload.delivered} : msg);
        },
        setRead: (state, action) => {
            state = state.map(msg => 
                msg.id === action.payload.id ? {...msg, read: action.payload.read} : msg)
        }        
    }
});

export const { loadMessages, update, deleteMessage, setDelivered, setRead } = AllMessages.actions;
export default AllMessages.reducer;