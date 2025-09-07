'use client';

import { useEffect } from 'react';
import { useAuth, useTokenMonitor } from '@/lib/auth-guards';

export function TokenMonitor() {
  const { isLoggedIn } = useAuth();
  const { checkTokenStatus } = useTokenMonitor({
    warningMinutes: 5,    // 提前5分钟警告
    checkInterval: 30000, // 每30秒检查一次
    autoLogout: true      // 自动登出
  });

  useEffect(() => {
    // 页面获得焦点时检查 token 状态
    const handleFocus = () => {
      if (isLoggedIn) {
        checkTokenStatus();
      }
    };

    // 页面可见性变化时检查 token 状态
    const handleVisibilityChange = () => {
      if (!document.hidden && isLoggedIn) {
        checkTokenStatus();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isLoggedIn, checkTokenStatus]);

  return null; 
}