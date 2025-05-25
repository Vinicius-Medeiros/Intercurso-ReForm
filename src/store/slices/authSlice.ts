import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EmpresaModal } from '../../models/empresa';

interface AuthState {
    isAuthenticated: boolean;
    user: EmpresaModal | null;
}

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<{ user: EmpresaModal }>) => {
            state.isAuthenticated = true;
            state.user = action.payload.user;
            
            // Store tokens in localStorage
            localStorage.setItem('user', JSON.stringify(action.payload.user));
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            
            // Clear tokens from localStorage
            localStorage.removeItem('user');
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer; 