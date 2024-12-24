// /app/hooks/useAuth.ts

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '@/app/_utils/axiosInstance';
import { loginStart, loginSuccess, loginFailure } from '@/app/store/slices/authSlice';
import { RootState } from '@/app/store';
import toast from 'react-hot-toast';
import { User } from '../types';

const useAuth = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchUser = async () => {
      dispatch(loginStart());
      try {
        const response = await axiosInstance.get('/auth/me', {
          withCredentials: true,
        });
        const userData: User = response.data.user;
        dispatch(loginSuccess(userData));
      } catch (error) {
        dispatch(loginFailure());
        toast.error('Failed to authenticate user.');
      }
    };

    if (!isAuthenticated && !loading) {
      fetchUser();
    }
  }, [isAuthenticated, loading, dispatch]);

  return { isAuthenticated, user, loading };
};

export default useAuth;
