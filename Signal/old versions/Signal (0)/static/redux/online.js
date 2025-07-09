import { createSlice } from '@reduxjs/toolkit';

const onlineSlice = createSlice({
    name: "onlineUsers",
    initialState: [],
    reducers: {
        loadOnlines: (state, action) => {
            state = action.payload;
        },
        updateOnline: (state, action) => {
            state = [...state, action.payload];
        },
        removeOnline: (state, action) => {
            state = state.filter((user) => user === action.payload.user);
        }
    }
});

export const { loadOnlines, updateOnline, removeOnline } = settings.actions;
export default onlineSlice.reducer;