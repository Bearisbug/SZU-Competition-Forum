"use client";
import {
  Link,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure,
} from "@heroui/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "lucide-react";
import { useAuthStore } from "@/lib/auth-guards";
import { API_BASE_URL } from "@/CONFIG";
import NotificationsModal from "@/components/NotificationsModal";

export default function IONavBar() {
  const pathname = usePathname();
  const router = useRouter();

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [hasNew, setHasNew] = useState(false);

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn);

  // 确保页面始终有滚动条，避免布局变化
  // 组件挂载后的初始化
  useEffect(() => {
    setMounted(true);
  }, []);

  // 控制蓝色导航栏显示隐藏
  const controlNavbar = () => {
    // 添加防抖，避免频繁切换
    const currentScrollY = window.scrollY;
    
    // 只有滚动距离超过一定阈值才切换状态
    if (Math.abs(currentScrollY - lastScrollY) > 10) {
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    }
  };

  // 客户端挂载后设置状态
  // 客户端挂载后设置状态
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(!!token);
  }, [setIsLoggedIn]);

  // 检查是否有新通知（基于最后查看时间）
  useEffect(() => {
    let interval: any;
    const checkNewNotifications = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          setHasNew(false);
          return;
        }
        const res = await fetch(`${API_BASE_URL}/api/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        const times = (data || []).map((n: any) => new Date(n.timestamp).getTime()).filter((t: number) => !isNaN(t));
        const latest = times.length ? Math.max(...times) : 0;
        const lastSeen = Number(localStorage.getItem("notifications:lastSeen") || 0);
        setHasNew(latest > lastSeen);
      } catch (_) {
        // 忽略错误
      }
    };
    if (mounted && isLoggedIn) {
      checkNewNotifications();
      interval = setInterval(checkNewNotifications, 30000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [mounted, isLoggedIn]);

  // 滚动监听
  useEffect(() => {
    if (mounted) {
      let ticking = false;
      
      const handleScroll = () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            controlNavbar();
            ticking = false;
          });
          ticking = true;
        }
      };
      
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [lastScrollY, mounted]);

  // 路由变化时检查登录状态
  useEffect(() => {
    if (mounted) {
      const token = localStorage.getItem("access_token");
      const loggedIn = !!token;
      if (loggedIn !== isLoggedIn) {
        setIsLoggedIn(loggedIn);
      }
    }
  }, [pathname, mounted, isLoggedIn, setIsLoggedIn]);

  // 监听存储变化
  useEffect(() => {
    if (mounted) {
      const handleStorageChange = () => {
        const token = localStorage.getItem("access_token");
        setIsLoggedIn(!!token);
      };

      window.addEventListener("storage", handleStorageChange);
      return () => window.removeEventListener("storage", handleStorageChange);
    }
  }, [setIsLoggedIn, mounted]);

  const isActive = (path: string) => mounted && pathname === path;

  const NavLink = ({ href, label }: { href: string; label: string }) => (
    <div
      className={`rounded-md ${isActive(href) ? "bg-[#940040]" : ""}`}
      style={{ height: "54px" }}
    >
      <Link
        href={href}
        className="relative flex items-center h-full px-4 font-bold text-white after:content-[''] 
          after:absolute after:bottom-0 after:left-0 
          after:w-0 after:h-1 after:bg-white 
          after:transition-all after:duration-300 
          hover:after:w-full hover:after:left-0"
      >
        {label}
      </Link>
    </div>
  );

  return (
    <>
      {/* 顶部白色导航栏 */}
      <div
        style={{ backgroundColor: "#fff", height: 60 }}
        className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-start gap-14 px-6 shadow-md"
      >
        <div className="flex items-center">
          <a
            href="https://www.szu.edu.cn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/NavLogo.png"
              alt="深圳大学"
              className="h-10 w-18 cursor-pointer"
            />
          </a>
        </div>
        <a
          href="https://csse.szu.edu.cn"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/CollegeLogo.png"
            alt="计软学院"
            className="h-10 w-30 cursor-pointer"
          />
        </a>
        <div className="flex items-center gap-2">
          <a href="/" rel="noopener noreferrer">
            <img
              src="/ForumLogo.png"
              alt="火种图标"
              className="h-10 w-10 cursor-pointer"
            />
          </a>
          <div className="flex flex-col leading-tight">
            <a href="/" rel="noopener noreferrer">
              <span className="text-sm font-semibold text-gray-800">
                火种云平台
              </span>
            </a>
          </div>
        </div>
        <div className="ml-auto">
          {mounted && isLoggedIn ? (
            <div className="relative inline-block align-middle">
              <Dropdown>
                <DropdownTrigger>
                  <Button isIconOnly variant="light" aria-label="User profile">
                    <User className="w-6 h-6 text-gray-800" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="User actions">
                  <DropdownItem key="notifications" onPress={() => { onOpen(); setHasNew(false); }}>
                    <span className="font-bold">消息</span>
                  </DropdownItem>
                  <DropdownItem
                    key="profile"
                    onPress={() =>
                      router.push(`/user/${localStorage.getItem("id")}`)
                    }
                  >
                    <span className="font-bold">个人主页</span>
                  </DropdownItem>
                  <DropdownItem
                    key="logout"
                    color="danger"
                    onPress={() => {
                      localStorage.removeItem("access_token");
                      localStorage.removeItem("id");
                      localStorage.removeItem("remember");
                      localStorage.removeItem("notifications:lastSeen");
                      setIsLoggedIn(false);
                      router.push('/');
                    }}
                  >
                    <span className="font-bold">登出</span>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
              {hasNew && (
                <span
                  className="pointer-events-none absolute -right-1 -top-1 inline-block w-3.5 h-3.5 bg-red-500 rounded-full ring-2 ring-white z-20"
                />
              )}
            </div>
          ) : mounted ? (
            <Button
              onPress={() => {
                // 使用平滑的路由跳转
                router.push("/user");
              }}
              variant="light"
              className="font-bold text-gray-800"
            >
              登录
            </Button>
          ) : (
            <div className="w-16 h-10" />
          )}
        </div>
      </div>

      {mounted && isLoggedIn && (
        <div
          className={`fixed top-[60px] left-0 right-0 transition-all duration-300 z-50`}
          style={{
            backgroundColor: "#024d8f",
            height: "54px",
            opacity: isVisible ? 1 : 0,
            pointerEvents: isVisible ? 'auto' : 'none',
          }}
        >
          <nav className="flex w-full h-full items-center justify-center">
            <div className="hidden sm:flex gap-10 items-center h-full">
              <NavLink href="/" label="首页" />
              <NavLink href="/competition" label="比赛" />
              <NavLink href="/recruitment" label="项目招聘" />
              <NavLink href="/article" label="文章" />
              <NavLink href="/teams" label="队伍" />
              {/* 通知入口已移动到右上角用户菜单 */}
              </div>
          </nav>
        </div>
      )}
      <NotificationsModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </>
  );
}
