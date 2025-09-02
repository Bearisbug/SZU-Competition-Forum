export interface TokenPayload {
  sub: string; // 用户ID
  exp: number; // 过期时间戳
  iat?: number; // 签发时间戳
  [key: string]: any;
}

export function parseJwtToken(token: string): TokenPayload | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('解析 JWT token 失败:', error);
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = parseJwtToken(token);
  if (!payload || !payload.exp) return true;
  
  const now = Math.floor(Date.now() / 1000);
  return payload.exp <= now;
}

export function isTokenExpiringSoon(token: string, minutesBefore: number = 5): boolean {
  const payload = parseJwtToken(token);
  if (!payload || !payload.exp) return true;
  
  const now = Math.floor(Date.now() / 1000);
  const warningTime = payload.exp - (minutesBefore * 60);
  
  return now >= warningTime;
}

export function getTokenRemainingTime(token: string): number {
  const payload = parseJwtToken(token);
  if (!payload || !payload.exp) return 0;
  
  const now = Math.floor(Date.now() / 1000);
  const remaining = payload.exp - now;
  
  return Math.max(0, remaining);
}

export function formatRemainingTime(seconds: number): string {
  if (seconds <= 0) return '已过期';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}小时${minutes}分钟`;
  } else if (minutes > 0) {
    return `${minutes}分钟${secs}秒`;
  } else {
    return `${secs}秒`;
  }
}

export function getValidToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  const token = localStorage.getItem('access_token');
  if (!token) return null;
  
  if (isTokenExpired(token)) {
    // Token 已过期，清除存储
    localStorage.removeItem('access_token');
    localStorage.removeItem('id');
    return null;
  }
  
  return token;
}

export function setupTokenExpirationWarning(
  token: string,
  onWarning: () => void,
  onExpired: () => void,
  warningMinutes: number = 5
): () => void {
  const payload = parseJwtToken(token);
  if (!payload || !payload.exp) {
    onExpired();
    return () => {};
  }
  
  const now = Date.now();
  const expTime = payload.exp * 1000;
  const warningTime = expTime - (warningMinutes * 60 * 1000);
  
  const timeouts: NodeJS.Timeout[] = [];
  
  // 设置警告定时器
  if (warningTime > now) {
    const warningTimeout = setTimeout(() => {
      onWarning();
    }, warningTime - now);
    timeouts.push(warningTimeout);
  } else if (!isTokenExpired(token)) {
    // 如果已经在警告时间内但未过期，立即触发警告
    onWarning();
  }
  
  // 设置过期定时器
  if (expTime > now) {
    const expiredTimeout = setTimeout(() => {
      onExpired();
    }, expTime - now);
    timeouts.push(expiredTimeout);
  } else {
    // 已经过期，立即触发
    onExpired();
  }
  
  // 返回清理函数
  return () => {
    timeouts.forEach(timeout => clearTimeout(timeout));
  };
}