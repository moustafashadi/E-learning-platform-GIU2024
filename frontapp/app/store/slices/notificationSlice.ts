import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../_utils/axiosInstance';

interface Notification {
  id: string;
  message: string;
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

export const fetchNotifications = createAsyncThunk('notifications/fetchNotifications', async (userId: string) => {
  const response = await axiosInstance.get(`/notifications`, { withCredentials: true });
  return response.data;
});

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {},
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

export default notificationSlice.reducer;