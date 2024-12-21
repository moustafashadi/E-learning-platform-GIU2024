'use client';

import { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import store from './store';
import { rehydrateAuthState } from './store/slices/authSlice';

function RehydrateAuthState() {
  const dispatch = useDispatch();

  useEffect(() => {
    const authState = localStorage.getItem('authState');
    if (authState) {
      dispatch(rehydrateAuthState(JSON.parse(authState)));
    }
  }, [dispatch]);

  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <RehydrateAuthState />
      {children}
    </Provider>
  );
}