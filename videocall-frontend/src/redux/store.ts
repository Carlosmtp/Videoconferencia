import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice.ts';

export const store = configureStore({
    reducer: {
        user: userReducer,
    },
    });