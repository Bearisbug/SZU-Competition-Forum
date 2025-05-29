"use client";
import {
  Navbar,
  NavbarContent,
  NavbarItem,
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
  const [isClient, setIsClient] = useState(false);

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn);

  // 控制蓝色导航栏显示隐藏
  const controlNavbar = () => {
    if (typeof window !== "undefined") {
      if (window.scrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(window.scrollY);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY]);
  useEffect(() => setIsClient(true), []);
  useEffect(() => {
    if (isClient) {
      const token = localStorage.getItem("access_token");
      setIsLoggedIn(!!token);
    }
  }, [isClient]);

  const isActive = (path: string) => pathname === path;

  const NavLink = ({ href, label }: { href: string; label: string }) => (
    <NavbarItem
      className={`rounded-md ${isActive(href) ? "bg-[#940040]" : ""}`}
      style={{ height: "54px" }}
    >
      <Link
        href={href}
        className={`relative flex items-center h-full px-4 font-bold text-white after:content-[''] 
          after:absolute after:bottom-0 after:left-0 
          after:w-0 after:h-1 after:bg-white 
          after:transition-all after:duration-300 
          hover:after:w-full hover:after:left-0`}
      >
        {label}
      </Link>
    </NavbarItem>
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
          {isClient &&
            (isLoggedIn ? (
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
            ) : (
              <Button onPress={() => router.push("/user")} variant="light" className="font-bold text-gray-800">
                登录
              </Button>
            ))}
        </div>
      </div>

      {/* 滚动隐藏的蓝色导航栏 */}
      <Navbar
        className={`fixed top-[60px] left-0 right-0 transition-transform duration-300 z-50 
        text-white shadow-md ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
        height="54px"
        style={{ backgroundColor: "#024d8f" }}
      >
        <NavbarContent className="hidden sm:flex gap-10" justify="center">
          <NavLink href="/" label="首页" />
          <NavLink href="/interact" label="互动交流" />
          <NavLink href="/CompetitionMessage" label="竞赛信息" />
          <NavLink href="/training" label="在线培训" />
          <NavLink href="/resource" label="资源共享" />
          <NavLink href="/display" label="成果展示" />
          <NavLink href="/competition" label="比赛" />
          <NavLink href="/article" label="文章" />
          <NavLink href="/notification" label="信息" />
          <NavLink href="/teams" label="队伍" />
        </NavbarContent>
      </Navbar>
    </>
  );
}