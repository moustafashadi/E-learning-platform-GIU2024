import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import courseReducer from './slices/courseSlice';
import notificationReducer from './slices/notificationSlice';
import quizReducer from './slices/quizResultSlice';
import authReducer from './slices/authSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    courses: courseReducer,
    notifications: notificationReducer,
    quizzes: quizReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;