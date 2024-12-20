// filepath: /f:/E-learning-platform-GIU2024/frontapp/store/slices/notificationSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../_utils/axiosInstance';

interface Notification {
  id: string;
  message: string;
  isRead: boolean; // Include read status for notifications
}

interface NotificationState {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  loading: false,
  error: null,
};

// Fetch notifications
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async () => {
    const response = await axiosInstance.get(`/notifications`, { withCredentials: true });
    return response.data.map((notification: any) => ({
      id: notification._id?.toString() || 'unknown-id',
      message: notification.message || 'No message available',
      isRead: notification.isRead || false,
    }));
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    markAsRead: (state, action) => {
      const notification = state.notifications.find((n) => n.id === action.payload);
      if (notification) notification.isRead = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload;
        state.loading = false;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch notifications';
      });
  },
});

export const selectNotifications = (state: any) => state.notifications.notifications;
export const selectUnreadNotifications = (state: any) =>
  state.notifications.notifications.filter((notification: Notification) => !notification.isRead);
export const selectNotificationLoading = (state: any) => state.notifications.loading;
export const selectNotificationError = (state: any) => state.notifications.error;

export const { markAsRead } = notificationSlice.actions;

export default notificationSlice.reducer;
