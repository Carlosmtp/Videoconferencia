import { createSlice } from "@reduxjs/toolkit";

interface VideoCallState {
    callStarted: boolean;
    camStatus: boolean;
    micStatus: boolean;
}

const initialState = {
    callStarted: false,
    camStatus: true,
    micStatus: true,
};

export const videoCallSlice = createSlice({
    name: "videoCall",
    initialState,
    reducers: {
        setCallStarted: (state, action) => {
            state.callStarted = action.payload;
        },
        setCamStatus: (state, action) => {
            state.camStatus = action.payload;
        },
        setMicStatus: (state, action) => {
            state.micStatus = action.payload;
        },
    },
});

export const { setCallStarted, setCamStatus, setMicStatus } = videoCallSlice.actions;

export default videoCallSlice.reducer;
