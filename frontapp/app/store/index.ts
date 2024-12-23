"use client";
import { configureStore } from '@reduxjs/toolkit';
import authReducer, { AuthState } from './slices/authSlice';
import courseReducer, { CourseState } from './slices/courseSlice';
import notificationReducer, { NotificationState } from './slices/notificationSlice';
import quizReducer, { QuizState } from './slices/quizResultSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: courseReducer,
    notifications: notificationReducer,
    quizzes: quizReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['notifications/setSocket'],
        ignoredPaths: ['notifications.socket'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;