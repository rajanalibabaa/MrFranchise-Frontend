// authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user_id: null,
    token: null,
    user_data: null,
    error: null,
    success: false,
    loading: false
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSuccess: (state) => {
            state.success = false;
        },
        setCredentials: (state, action) => {
            state.user_id = action.payload.user_id;
            state.token = action.payload.token;
            state.user_data = action.payload.user_data || null;
            state.loading = false;
            state.success = true;
            
            localStorage.setItem("auth", JSON.stringify({
                user_id: action.payload.user_id,
                token: action.payload.token,
                user_data: action.payload.user_data || null
            }));
        },
        loadFromStorage: (state) => {
            const storedAuth = localStorage.getItem("auth");
            if (storedAuth) {
                const { user_id, token, user_data } = JSON.parse(storedAuth);
                state.user_id = user_id;
                state.token = token;
                state.user_data = user_data;
            }
        },
        logout: (state) => {
            state.user_id = null;
            state.token = null;
            state.user_data = null;
            localStorage.removeItem("auth");
        },
        updateUserData: (state, action) => {
            state.user_data = { ...state.user_data, ...action.payload };
            const storedAuth = localStorage.getItem("auth");
            if (storedAuth) {
                const authData = JSON.parse(storedAuth);
                localStorage.setItem("auth", JSON.stringify({
                    ...authData,
                    user_data: { ...authData.user_data, ...action.payload }
                }));
            }
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    }
});

export const { 
    setCredentials, 
    loadFromStorage, 
    logout, 
    updateUserData,
    setLoading,
    setError,
    clearError,
    clearSuccess
} = authSlice.actions;

export default authSlice.reducer;