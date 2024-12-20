// filepath: /f:/E-learning-platform-GIU2024/frontapp/store/slices/courseSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../_utils/axiosInstance';

interface Course {
  id: string;
  name: string;
  progress: number;
}

interface CourseState {
  courses: Course[];
  loading: boolean;
  error: string | null;
}

const initialState: CourseState = {
  courses: [],
  loading: false,
  error: null,
};

//fetches enrolled courses
export const fetchCourses = createAsyncThunk('courses/fetchCourses', async (userId: string) => {
  const response = await axiosInstance.get(`/users/${userId}/enrolledCourses`, { withCredentials: true });
  return response.data;
});

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.courses = action.payload;
        state.loading = false;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch courses';
      });
  },
});

export default courseSlice.reducer;