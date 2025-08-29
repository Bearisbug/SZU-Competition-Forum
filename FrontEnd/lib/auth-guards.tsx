'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { create } from "zustand";
import { API_BASE_URL } from '@/CONFIG';
import toast from "react-hot-toast";

// 集成 AuthStore 功能
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
  logout: () => set({ isLoggedIn: false, user: null }),
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
          // 这里可以添加验证 token 有效性的逻辑
          // 例如向后端发送请求验证 token
          
          // 获取用户信息
          try {
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
            } else {
              // Token 无效，清除本地存储
              localStorage.removeItem('access_token');
              localStorage.removeItem('id');
              setIsLoggedIn(false);
            }
          } catch (error) {
            console.error('获取用户信息失败:', error);
            setIsLoggedIn(false);
          }
        } else {
          setIsLoggedIn(false);
        }
      } finally {
        setLoading(false);
      }
    };
    
    checkLoginStatus();
  }, [setIsLoggedIn, setLoading, setUser]);
  
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