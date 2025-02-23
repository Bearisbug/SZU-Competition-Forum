"use client";

import React, { useState, useEffect } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import {
  Home,
  Search,
  Bell,
  User,
  UserRound,
  UsersRound,
  Newspaper,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "./AuthStore";

export default function ScrollableNavbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const isLoggedIn = useAuthStore(
    (state: { isLoggedIn: any }) => state.isLoggedIn
  );
  const setIsLoggedIn = useAuthStore(
    (state: { setIsLoggedIn: any }) => state.setIsLoggedIn
  );

  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const token = localStorage.getItem("access_token");
      setIsLoggedIn(!!token);
    }
  }, [isClient]);

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
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar);
      return () => {
        window.removeEventListener("scroll", controlNavbar);
      };
    }
  }, [lastScrollY]);

  return (
    <Navbar
      className={`fixed top-0 left-0 right-0 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
      height="54px"
    >
      <NavbarBrand>
        <svg
          width="100"
          height="54"
          viewBox="0 0 36 36"
          xmlns="http://www.w3.org/2000/svg"
          className="bg-[#881940]"
        >
          <image
            href="https://www1.szu.edu.cn/images/szu.png"
            width="36"
            height="36"
          />
        </svg>
        <p className="font-bold text-inherit ml-4 ">竞赛论坛</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="/">
            <Home className="w-6 h-6" />
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/competition">
            <Search className="w-6 h-6" />
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/article">
            <Newspaper className="w-6 h-6" />
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/notification">
            <Bell className="w-6 h-6" />
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/teams">
            <UsersRound className="w-6 h-6" />
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          {isClient &&
            (isLoggedIn ? (
              <Dropdown>
                <DropdownTrigger>
                  <Button isIconOnly variant="light" aria-label="User profile">
                    <User className="w-6 h-6" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="User actions">
                  <DropdownItem
                    key="profile"
                    onPress={() =>
                      router.push(`/user/${localStorage.getItem("id")}`)
                    }
                  >
                    个人主页
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
                    登出
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            ) : (
              <Button onPress={() => router.push("/user")} variant="light">
                登录
              </Button>
            ))}
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
