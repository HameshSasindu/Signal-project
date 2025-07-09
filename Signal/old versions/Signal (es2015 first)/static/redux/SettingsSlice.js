import { createSlice } from "@reduxjs/toolkit";

const settingsSlice = createSlice({
    name: "settings",
    initialState: {
        settings: []
    },
    reducers: {
        load: (state, action) => {
            state.settings = action.payload;
        }
    }
});

export const { load } = settingsSlice.actions;
export default settingsSlice.reducer;
