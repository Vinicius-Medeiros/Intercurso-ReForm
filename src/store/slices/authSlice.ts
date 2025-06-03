import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Company } from '../../Services/auth';

interface AuthState {
    isAuthenticated: boolean;
    user: Company | null;
}

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<{ user: Company }>) => {
            state.isAuthenticated = true;
            state.user = action.payload.user;
            // Store user data in localStorage for persistence across page reloads
            localStorage.setItem('user', JSON.stringify(action.payload.user));
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            // Clear user data from localStorage
            localStorage.removeItem('user');
        },
        // Add a new action to update user data
        updateUser: (state, action: PayloadAction<{ user: Company }>) => {
            state.user = action.payload.user;
            // Update user data in localStorage
            localStorage.setItem('user', JSON.stringify(action.payload.user));
        }
    },
});

export const { login, logout, updateUser } = authSlice.actions;
export default authSlice.reducer; 