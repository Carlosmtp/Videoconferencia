import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    name: "",
    email: "",
    photoURL: "",
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.name = action.payload.displayName;
            state.email = action.payload.email;
            state.photoURL = action.payload.photoURL;
        },
        changeName: (state, action) => {
            state.name = action.payload;
        },
        changePhotoURL: (state, action) => {
            state.photoURL = action.payload;
        }
    },
});

export const { setUser, changeName, changePhotoURL } = userSlice.actions;
export default userSlice.reducer;