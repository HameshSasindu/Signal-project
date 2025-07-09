import { createSlice } from '@reduxjs/toolkit';

const onlineSlice = createSlice({
    name: "onlineUsers",
    initialState: new Set(),
    reducers: {
        loadOnlines: (state, action) => {
            return new Set(action.payload);
        },
        updateOnline: (state, action) => {
            state.add(action.payload);
        },
        removeOnline: (state, action) => {
            state.delete(action.payload);
        }
    }
});

export const { loadOnlines, updateOnline, removeOnline } = onlineSlice.actions;
export default onlineSlice.reducer;