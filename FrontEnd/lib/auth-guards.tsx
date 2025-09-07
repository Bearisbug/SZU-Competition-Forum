'use client';

import { useEffect, ReactNode, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { create } from "zustand";
import { API_BASE_URL } from '@/CONFIG';
import toast from "react-hot-toast";
import { 
  getValidToken, 
  isTokenExpiringSoon, 
  getTokenRemainingTime,
  setupTokenExpirationWarning 
} from '@/lib/token-utils';

type AuthState = {
  isLoggedIn: boolean;
  loading: boolean;
  user: {
    id?: string;
    name?: string;
    role?: string;
  } | null;
  setIsLoggedIn: (value: boolean) => void;
  setUser: (user: AuthState['user']) => void;
  setLoading: (value: boolean) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false, // 初始状态设为 false，避免水合错误
  loading: true,     // 默认为加载状态
  user: null,        // 用户信息
  setIsLoggedIn: (value: boolean) => set({ isLoggedIn: value }),
  setUser: (user) => set({ user }),
  setLoading: (value: boolean) => set({ loading: value }),
  logout: () => {
    // 清除本地存储
    localStorage.removeItem('access_token');
    localStorage.removeItem('id');
    localStorage.removeItem('remember');
    // 更新状态
    set({ isLoggedIn: false, user: null });
  },
}));

// 自定义 Hook，用于获取和管理认证状态
export function useAuth() {
  const { isLoggedIn, loading, user, setIsLoggedIn, setUser, setLoading, logout } = useAuthStore();
  
  useEffect(() => {
    // 页面加载时检查登录状态
    const checkLoginStatus = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('access_token');
        const userId = localStorage.getItem('id');
        
        if (token && userId) {
          // 检查 token 是否过期
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const exp = payload.exp * 1000; // 转换为毫秒
            const now = Date.now();
            
            if (exp <= now) {
              // Token 已过期
              localStorage.removeItem('access_token');
              localStorage.removeItem('id');
              setIsLoggedIn(false);
              toast.error('登录已过期，请重新登录');
              return;
            }
            
            // Token 未过期，获取用户信息
            const response = await fetch(`${API_BASE_URL}/api/user/info/${userId}`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            
            if (response.ok) {
              const userData = await response.json();
              setUser({
                id: userId,
                name: userData.name,
                role: userData.role
              });
              setIsLoggedIn(true);
            } else if (response.status === 401 || response.status === 403) {
              // 仅在未授权时登出
              localStorage.removeItem('access_token');
              localStorage.removeItem('id');
              setIsLoggedIn(false);
              toast.error('登录已过期，请重新登录');
            } else {
              // 服务器错误或其他错误，保留登录态，避免误登出
              setIsLoggedIn(true);
              // 可选提示（避免频繁打扰）
              console.warn('获取用户信息失败：', response.status);
            }
          } catch (error) {
            console.error('Token 解析或获取用户信息失败:', error);
            // 非法 token 才清除；否则保留当前登录态
            try {
              const payload = JSON.parse(atob((localStorage.getItem('access_token') || '').split('.')[1] || 'null'));
              if (!payload) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('id');
                setIsLoggedIn(false);
              } else {
                setIsLoggedIn(true);
              }
            } catch {
              localStorage.removeItem('access_token');
              localStorage.removeItem('id');
              setIsLoggedIn(false);
            }
          }
        } else {
          setIsLoggedIn(false);
        }
      } finally {
        setLoading(false);
      }
    };
    
    // 监听全局登出事件
    const handleLogout = () => {
      logout();
      setLoading(false);
    };
    
    window.addEventListener('auth:logout', handleLogout);
    checkLoginStatus();
    
    return () => {
      window.removeEventListener('auth:logout', handleLogout);
    };
  }, [setIsLoggedIn, setLoading, setUser, logout]);
  
  return { isLoggedIn, loading, user, setIsLoggedIn, setUser, logout };
}

// 登录状态校验的高阶组件
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthGuard(props: P) {
    const { isLoggedIn, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !isLoggedIn) {
        router.push('/');
        toast.error('请先登录');
      }
    }, [isLoggedIn, loading, router]);

    // 如果正在加载或未登录，则不渲染组件
    if (loading || !isLoggedIn) {
      return <div className="flex justify-center items-center min-h-screen">正在验证登录状态...</div>;
    }

    return <Component {...props} />;
  };
}

// 管理员身份校验的高阶组件
export function withAdmin<P extends object>(Component: React.ComponentType<P>) {
  return function AdminGuard(props: P) {
    const { isLoggedIn, loading, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading) {
        if (!isLoggedIn) {
          router.push('/');
          toast.error('请先登录');
        } else if (user?.role !== 'admin') {
          router.push('/');
          toast.error('您没有管理员权限');
        }
      }
    }, [isLoggedIn, loading, router, user]);

    // 如果正在加载或未登录或不是管理员，则不渲染组件
    if (loading || !isLoggedIn || user?.role !== 'admin') {
      return <div className="flex justify-center items-center min-h-screen">正在验证权限...</div>;
    }

    return <Component {...props} />;
  };
}

// 登录状态校验的组件包装器
export function AuthGuard({ children }: { children: ReactNode }) {
  const { isLoggedIn, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push('/');
      toast.error('请先登录');
    }
  }, [isLoggedIn, loading, router]);

  // 如果正在加载或未登录，则不渲染子组件
  if (loading || !isLoggedIn) {
    return <div className="flex justify-center items-center min-h-screen">正在验证登录状态...</div>;
  }

  return <>{children}</>;
}

// 管理员身份校验的组件包装器
export function AdminGuard({ children }: { children: ReactNode }) {
  const { isLoggedIn, loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isLoggedIn) {
        router.push('/');
        toast.error('请先登录');
      } else if (user?.role !== 'admin') {
        router.push('/');
        toast.error('您没有管理员权限');
      }
    }
  }, [isLoggedIn, loading, router, user]);

  // 如果正在加载或未登录或不是管理员，则不渲染子组件
  if (loading || !isLoggedIn || user?.role !== 'admin') {
    return <div className="flex justify-center items-center min-h-screen">正在验证权限...</div>;
  }

  return <>{children}</>;
}

// 自定义Hook，用于在函数组件内部进行校验
export function useAuthGuard() {
  const { isLoggedIn, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push('/');
      alert('请先登录');
    }
  }, [isLoggedIn, loading, router]);

  return { isAuthenticated: !loading && isLoggedIn };
}

// 自定义Hook，用于在函数组件内部进行管理员校验
export function useAdminGuard() {
  const { isLoggedIn, loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isLoggedIn) {
        router.push('/');
        alert('请先登录');
      } else if (user?.role !== 'admin') {
        router.push('/');
        alert('您没有管理员权限');
      }
    }
  }, [isLoggedIn, loading, router, user]);

  return { isAdmin: !loading && isLoggedIn && user?.role === 'admin' };
}

// Token 监控相关接口和 Hook
interface UseTokenMonitorOptions {
  warningMinutes?: number; // 提前多少分钟警告，默认5分钟
  checkInterval?: number;  // 检查间隔，默认30秒
  autoLogout?: boolean;    // 是否自动登出，默认true
}

export function useTokenMonitor(options: UseTokenMonitorOptions = {}) {
  const {
    warningMinutes = 5,
    checkInterval = 30000, // 30秒
    autoLogout = true
  } = options;

  const router = useRouter();
  const { logout } = useAuthStore();
  const intervalRef = useRef<NodeJS.Timeout>();
  const cleanupRef = useRef<(() => void) | null>(null);
  const hasWarned = useRef(false);

  const handleTokenExpired = useCallback(() => {
    // 强制退出登录，不管 autoLogout 设置如何
    logout();
    toast.error('登录已过期，请重新登录');
    router.push('/');
  }, [logout, router]);

  const handleTokenWarning = useCallback(() => {
    if (!hasWarned.current) {
      hasWarned.current = true;
      const token = getValidToken();
      if (token) {
        const remainingTime = getTokenRemainingTime(token);
        const minutes = Math.floor(remainingTime / 60);
        toast.error(`登录将在 ${minutes} 分钟后过期，请及时保存数据`);
      }
    }
  }, []);

  const checkTokenStatus = useCallback(() => {
    // 只在浏览器环境中执行
    if (typeof window === 'undefined') return;
    
    const storedToken = localStorage.getItem('access_token');
    
    // 如果本来就没有 token，不需要执行任何操作
    if (!storedToken) {
      return;
    }
    
    const token = getValidToken();
    
    if (!token) {
      // Token 存在但已过期，需要登出
      handleTokenExpired();
      return;
    }

    // 检查是否即将过期
    if (isTokenExpiringSoon(token, warningMinutes)) {
      handleTokenWarning();
    }
  }, [warningMinutes, handleTokenExpired, handleTokenWarning]);

  useEffect(() => {
    // 只有在浏览器环境且有 token 时才启动监控
    if (typeof window === 'undefined') return;
    
    const token = getValidToken();
    
    if (token) {
      // 设置定期检查
      intervalRef.current = setInterval(checkTokenStatus, checkInterval);
      
      // 设置过期警告和自动登出
      cleanupRef.current = setupTokenExpirationWarning(
        token,
        handleTokenWarning,
        handleTokenExpired,
        warningMinutes
      );
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, [checkInterval, warningMinutes, checkTokenStatus, handleTokenWarning, handleTokenExpired]);

  return {
    checkTokenStatus,
    getRemainingTime: () => {
      const token = getValidToken();
      return token ? getTokenRemainingTime(token) : 0;
    }
  };
}
