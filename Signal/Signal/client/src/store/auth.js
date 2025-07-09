import { createSlice } from '@reduxjs/toolkit';

const AuthSlice = createSlice({
    name: "auth",
    initialState: {
        name: "",
        phone: "",
        bio: "",
        isAuthenticated: false
    },
    reducers: {
        authenticate: (state, action) => {
            Object.assign(state, action.payload);
        }
    }
});

export const { authenticate } = AuthSlice.actions;
export default AuthSlice.reducer;
