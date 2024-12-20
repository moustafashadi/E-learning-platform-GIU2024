// filepath: /hooks/useAuth.ts
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import setauthsta

const useAuth = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("/auth/me", { withCredentials: true });
        dispatch(
          setAuthState({
            isAuthenticated: true,
            loading: false,
            user: response.data.user,
          })
        );
      } catch (error) {
        dispatch(
          setAuthState({
            isAuthenticated: false,
            loading: false,
            user: null,
          })
        );
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [dispatch]);

  return { loading };
};

export default useAuth;
