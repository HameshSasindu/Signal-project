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
            state = action.payload;
        }
    }
});

export const { authenticate } = AuthSlice.actions;
export default AuthSlice.actions;
