import { createSlice } from '@reduxjs/toolkit';

const settings = createSlice({
    name: "settings",
    initialState: [],
    reducers: {
        load: (state, action) => {
            state = action.payload;
        }
    }
});

export const { load } = settings.actions;
export default settings.reducer;