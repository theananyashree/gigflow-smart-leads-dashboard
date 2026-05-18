import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { IUser, IAuthState, ILoginForm, IRegisterForm } from '../types';
import { authApi } from '../api/auth';
import toast from 'react-hot-toast';

interface IAuthContext extends IAuthState {
  login: (data: ILoginForm) => Promise<boolean>;
  register: (data: IRegisterForm) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<IAuthState>({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    isLoading: true,
  });

  const setAuth = (user: IUser, token: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setState({ user, token, isAuthenticated: true, isLoading: false });
  };

  const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
  };

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }
      try {
        const res = await authApi.getMe();
        if (res.data.data) {
          setState({
            user: res.data.data as IUser,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        }
      } catch {
        clearAuth();
      }
    };
    verifyToken();
  }, []);

  const login = useCallback(async (data: ILoginForm): Promise<boolean> => {
    try {
      const res = await authApi.login(data);
      if (res.data.data) {
        setAuth(res.data.data.user, res.data.data.token);
        toast.success(`Welcome back, ${res.data.data.user.name}!`);
        return true;
      }
      return false;
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message ?? 'Login failed';
      toast.error(message);
      return false;
    }
  }, []);

  const register = useCallback(async (data: IRegisterForm): Promise<boolean> => {
    try {
      const res = await authApi.register(data);
      if (res.data.data) {
        setAuth(res.data.data.user, res.data.data.token);
        toast.success('Account created successfully!');
        return true;
      }
      return false;
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message ?? 'Registration failed';
      toast.error(message);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    toast.success('Logged out');
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): IAuthContext => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};