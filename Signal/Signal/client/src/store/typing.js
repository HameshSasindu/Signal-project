import { createSlice } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

const typingSlice = createSlice({
    name: "typing",
    initialState: new Set(),
    reducers: {
        add: (state, action) => {
            state.add(action.payload);      
        },
        remove: (state, action) => {
            state.delete(action.payload);
        }
    }
});

export function useIsTyping(phone) {
    const typing = useSelector((state) => state.typing);
    return typing.has(phone);
}


export const { add, remove } = typingSlice.actions;
export default typingSlice.reducer;
