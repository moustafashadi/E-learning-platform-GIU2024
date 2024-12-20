// filepath: /f:/E-learning-platform-GIU2024/frontapp/store/slices/quizResultSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../_utils/axiosInstance';

interface QuizResult {
  quizId: string;
  courseId: string;
  score: number;
}

interface QuizState {
  results: QuizResult[];
  loading: boolean;
  error: string | null;
}

const initialState: QuizState = {
  results: [],
  loading: false,
  error: null,
};

// Fetch quizzes by course ID
export const fetchQuizzesByCourse = createAsyncThunk(
  'quizzes/fetchByCourse',
  async (courseId: string) => {
    const response = await axiosInstance.get(`/quiz/course/${courseId}`, { withCredentials: true });
    return response.data;
  }
);

const quizSlice = createSlice({
  name: 'quizzes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizzesByCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuizzesByCourse.fulfilled, (state, action) => {
        state.results = action.payload;
        state.loading = false;
      })
      .addCase(fetchQuizzesByCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch quizzes';
      });
  },
});

export const selectQuizResults = (state: any) => state.quizzes.results;
export const selectQuizLoading = (state: any) => state.quizzes.loading;
export const selectQuizError = (state: any) => state.quizzes.error;

export default quizSlice.reducer;
