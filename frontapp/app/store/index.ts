// /store/index.ts
'use client';

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import courseReducer from './slices/courseSlice';
import notificationReducer from './slices/notificationSlice';
import quizReducer from './slices/quizResultSlice';

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
