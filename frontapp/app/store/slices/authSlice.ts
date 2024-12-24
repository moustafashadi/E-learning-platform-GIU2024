// /store/slices/authSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  _id: string;
  email: string;
  username: string;
  profilePicUrl: string;
  role: 'admin' | 'student' | 'instructor';
  enrolledCourses: string[]; // Array of course IDs
  completedCourses: string[];
  quizzesSolved: string[];
  notifications: string[]; // Array of notification IDs
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
    },
    loginSuccess(state, action: PayloadAction<User>) {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.loading = false;
    },
    loginFailure(state) {
      state.loading = false;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.loading = false;
    },
    rehydrateAuthState(state, action: PayloadAction<AuthState>) {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.user = action.payload.user;
      state.loading = false;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, rehydrateAuthState } = authSlice.actions;
export default authSlice.reducer;
