// filepath: /f:/E-learning-platform-GIU2024/frontapp/store/index.ts
"use client";
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import courseReducer from './slices/courseSlice';
import notificationReducer from './slices/notificationSlice';
import quizReducer from './slices/quizResultSlice';
import authReducer from './slices/authSlice';


const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: courseReducer,
    notifications: notificationReducer,
    quizzes: quizReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; // Export AppDispatch

export default store;
