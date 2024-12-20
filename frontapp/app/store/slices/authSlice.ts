// filepath: /store/slices/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  user: { id: string; role: string } | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  loading: true,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthState(state, action: PayloadAction<AuthState>) {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.loading = action.payload.loading;
      state.user = action.payload.user;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { setAuthState, logout } = authSlice.actions;

export const selectAuthState = (state: any) => state.auth; // Selector to access auth state

export default authSlice.reducer;
