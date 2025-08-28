"use client";
import {
  Link,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "lucide-react";
import { useAuthStore } from "./AuthStore";

export default function IONavBar() {
  const pathname = usePathname();
  const router = useRouter();

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn);

  // 控制蓝色导航栏显示隐藏
  const controlNavbar = () => {
    if (window.scrollY > lastScrollY) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
    setLastScrollY(window.scrollY);
  };

  // 客户端挂载后设置状态
  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(!!token);
  }, [setIsLoggedIn]);

  // 滚动监听
  useEffect(() => {
    if (mounted) {
      window.addEventListener("scroll", controlNavbar);
      return () => window.removeEventListener("scroll", controlNavbar);
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

      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
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
        <div className="flex items-center gap-2">
          <img src="/SZU-logo.png" alt="深圳大学" className="h-10 w-12 cursor-pointer" />
          <img src="/szu.png" alt="深圳大学" className="h-10 w-30 cursor-pointer" />
        </div>
        <img src="/logo_red.png" alt="计软学院" className="h-10 w-30 cursor-pointer" />
        <div className="flex items-center gap-2">
          <img src="/huozhong.png" alt="火种图标" className="h-10 w-10 cursor-pointer" />
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-gray-800">火种云平台</span>
          </div>
        </div>
        <div className="ml-auto">
          {mounted && isLoggedIn ? (
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly variant="light" aria-label="User profile">
                  <User className="w-6 h-6 text-gray-800" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="User actions">
                <DropdownItem key="profile" onPress={() => router.push(`/user/${localStorage.getItem("id")}`)}>
                  <span className="font-bold">个人主页</span>
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  color="danger"
                  onPress={() => {
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("id");
                    setIsLoggedIn(false);
                    window.location.reload();
                  }}
                >
                  <span className="font-bold">登出</span>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : mounted ? (
            <Button onPress={() => router.push("/user")} variant="light" className="font-bold text-gray-800">
              登录
            </Button>
          ) : (
            <div className="w-16 h-10" />
          )}
        </div>
      </div>

      {/* 蓝色导航栏 - 只有登录用户才显示 */}
      {mounted && isLoggedIn && (
        <div
          className={`fixed top-[60px] left-0 right-0 transition-all duration-300 z-50 
          ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
          style={{ 
            backgroundColor: "#024d8f",
            height: "54px"
          }}
        >
          <nav className="flex w-full h-full items-center justify-center">
            <div className="hidden sm:flex gap-10 items-center h-full">
              <NavLink href="/" label="首页" />
              <NavLink href="/communication" label="互动交流" />
              <NavLink href="/training" label="在线培训" />
              <NavLink href="/resource" label="资源共享" />
              <NavLink href="/display" label="成果展示" />
              {/* <NavLink href="/competition" label="比赛" /> */}
              {/* <NavLink href="/article" label="文章" /> */}
              <NavLink href="/notification" label="信息" />
              {/* <NavLink href="/teams" label="队伍" /> */}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}