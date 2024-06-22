import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice.ts';
import videoCallReducer from './videoCallSlice.ts';

export const store = configureStore({
    reducer: {
        user: userReducer,
        videoCall: videoCallReducer,
    },
    });