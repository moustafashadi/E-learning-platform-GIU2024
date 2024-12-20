import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../_utils/axiosInstance';

interface QuizResult {
  courseId: string;
  score: number;
}

interface QuizState {
  quizResults: QuizResult[];
  loading: boolean;
  error: string | null;
}

const initialState: QuizState = {
  quizResults: [],
  loading: false,
  error: null,
};

export const fetchQuizResults = createAsyncThunk('quizzes/fetchQuizResults', async ({ courseId, userId }: { courseId: string; userId: string }) => {
  const response = await axiosInstance.get(`/quiz/${courseId}/${userId}`, { withCredentials: true });
  return response.data;
});

const quizSlice = createSlice({
  name: 'quizzes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuizResults.fulfilled, (state, action) => {
        state.quizResults.push(action.payload);
        state.loading = false;
      })
      .addCase(fetchQuizResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch quiz results';
      });
  },
});

export default quizSlice.reducer;