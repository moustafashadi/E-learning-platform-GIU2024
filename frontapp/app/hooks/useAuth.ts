// /hooks/useAuth.ts
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '@/app/_utils/axiosInstance';
import { loginSuccess, logout } from '@/app/store/slices/authSlice';
import { RootState } from '@/app/store';
import toast from 'react-hot-toast';

const useAuth = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get('/auth/me', {
          withCredentials: true,
        });
        const userData = response.data.user;
        if (userData) {
          dispatch(loginSuccess(userData));
        } else {
          dispatch(logout());
        }
      } catch (error) {
        dispatch(logout());
        toast.error('Authentication failed.');
        console.error('Authentication Error:', error);
      }
    };

    fetchUser();
  }, [dispatch]);

  return { isAuthenticated, user, loading };
};

export default useAuth;
