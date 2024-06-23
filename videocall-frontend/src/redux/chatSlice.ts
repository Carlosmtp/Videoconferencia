import { createSlice } from "@reduxjs/toolkit";

interface ChatHistory {
    history: string
}

const initialState = {
    history: "",
};

export const chatSlice = createSlice({
    name: "chatHistory",
    initialState,
    reducers: {
        concatNewMessage: (state, action) => {
            state.history += action.payload +"\n";
        }
    },
});

export const { concatNewMessage } = chatSlice.actions;

export default chatSlice.reducer;
