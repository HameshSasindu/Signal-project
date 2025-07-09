import { createSlice } from "@reduxjs/toolkit";

const onlineSlice = createSlice({
    name: "onlineUsers",
    initialState: {
        onlineUsers: []
    },
    reducers: {
        loadOnlines: (state, action) => {
            state.onlineUsers = action.payload;
        },
        updateOnline: (state, action) => {
            state.onlineUsers = [...state.onlineUsers, action.payload];
        },
        removeOnline: (state, action) => {
            state.onlineUsers = state.onlineUsers.filter((user) => user === action.payload.user);
        }
    }
});

export const { loadOnlines } = onlineSlice.actions;
export default onlineSlice.reducer;