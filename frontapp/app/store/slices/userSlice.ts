import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../_utils/axiosInstance';
// filepath: /f:/E-learning-platform-GIU2024/frontapp/store/slices/userSlice.ts
export const selectUserId = (state: any) => state.user.userId;
export const selectUserLoading = (state: any) => state.user.loading;
export const selectUserError = (state: any) => state.user.error;

interface UserState {
  userId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  userId: null,
  loading: false,
  error: null,
};

export const fetchUser = createAsyncThunk('user/fetchUser', async () => {
  const response = await axiosInstance.get('/auth/me', { withCredentials: true });
  return response
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.userId = action.payload.data.id;
        state.loading = false;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user';
      });
  },
});

export default userSlice.reducer;