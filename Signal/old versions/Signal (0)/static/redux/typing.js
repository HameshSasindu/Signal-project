import { createSlice } from '@reduxjs/toolkit';

const typingSlice = createSlice({
    name: "typing",
    initialState: [],
    reducers: {
        add: (state, action) => {
            if(!state.includes(action.payload)) {
                state.push(action.payload);    
            }
        },
        remove: (state, action) => {
            if(state.includes(action.payload)) {
                return state.filter(item => item !== action.payload);
            }
        },
    }
});


export const { add, remove } = typingUsers.actions;
export default typingSlice.reducer;