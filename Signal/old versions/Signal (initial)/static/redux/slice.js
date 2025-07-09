const MessagesSlice = RTK.createSlice({
    name: "allMessages",
    initialState: {
        value: []
    },
    reducers: {
        loadMessages: (state, action) => {
            state.value = action.payload;
        },
        update: (state, action) => {
            state.value.push(action.payload);
        }
    }
    
})