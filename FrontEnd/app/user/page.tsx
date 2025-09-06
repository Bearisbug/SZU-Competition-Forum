"use client";
import crypto from "crypto";
import React, { useState } from "react";
import {
  Button,
  Input,
  Checkbox,
  Link,
  Divider,
  Card,
  CardBody,
  Spinner,
  Select,
  SelectItem,
} from "@heroui/react";
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/lib/auth-guards";
import { API_BASE_URL } from "@/CONFIG";

interface User {
  id: number;
  password: string;
}

const createUser = async (userId: string, password: string,  email: string, role: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/api/user/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: userId, password, role, email }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData?.detail || '注册失败，请稍后再试！';
      throw new Error(errorMessage); 
    }
  
    return response.json(); 
  };

  const loginUser = async (userId: string, password: string): Promise<{ access_token: string }> => {
    const response = await fetch(`${API_BASE_URL}/api/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: userId, password }),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData?.detail || '登录失败，请检查账号和密码！';
      throw new Error(errorMessage);
    }
  
    return response.json(); // 返回登录成功后的数据
  };

    const loginTeacher = async (userId: string, password: string, email: string, code: string): Promise<{ access_token: string }> => {
    const response = await fetch(`${API_BASE_URL}/api/user/login-teacher`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: userId, password, email, code }),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData?.detail || '登录失败，请检查账号和密码！';
      throw new Error(errorMessage);
    }
  
    return response.json(); // 返回登录成功后的数据
  };

  const sendEmailCode = async  (email: string) =>{
    const res = await fetch(`${API_BASE_URL}/api/user/send-email-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    const data = await res.json(); 

    if (!res.ok) {
       throw new Error(data?.detail || "发送失败");
    }
    return data; //返回验证码
  }



export default function AuthPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [isLoading, setIsLoading] = useState(false);

  const toggleTab = () => {
    setActiveTab(activeTab === "login" ? "register" : "login");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 px-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="w-1/3"
        >
          <Card className="mx-auto w-full max-w-[600px] p-6 shadow-lg rounded-lg">
            <CardBody className="gap-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <h1 className="text-2xl font-semibold text-gray-800">
                  {activeTab === "login" ? "欢迎回来" : "深圳大学竞赛论坛"}
                </h1>
                <p className="text-sm text-gray-600">
                  {activeTab === "login"
                    ? "登录您的账户以继续"
                    : "欢迎你的加入！"}
                </p>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Spinner size="lg" />
                </div>
              ) : (
                activeTab === "login" ? (
                  <LoginForm setIsLoading={setIsLoading} />
                ) : (
                  <RegisterForm setIsLoading={setIsLoading} />
                )
              )}

              <div className="flex items-center gap-4">
                <Divider className="flex-1" />
                <span className="text-xs text-gray-500">或者</span>
                <Divider className="flex-1" />
              </div>

              <div className="text-center">
                <span className="text-sm text-gray-600">
                  {activeTab === "login" ? "还没有账户？" : "已经有账户？"}{" "}
                </span>
                <Link onClick={toggleTab} className="text-blue-500 cursor-pointer text-sm">
                  {activeTab === "login" ? "注册" : "登录"}
                </Link>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function LoginForm({ setIsLoading }: { setIsLoading: (isLoading: boolean) => void }) {
  const router = useRouter();
  const [role, setRole] = useState("学生");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [remember, setRemember] = useState(false);
  const isLoggedIn = useAuthStore((state: { isLoggedIn: any; }) => state.isLoggedIn);
  const setIsLoggedIn = useAuthStore((state: { setIsLoggedIn: any; }) => state.setIsLoggedIn);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSendCode = async () => {
    if (!email) {
      toast.error("请输入邮箱！");
      return;
    }
    try {
      const data = await sendEmailCode(email); // 调用后端接口，发送验证码
      if (data?.message) {
        toast.success(data.message); 
    } else {
        toast.success("验证码已发送，请查收邮箱！");
    }
        setIsCodeSent(true);
        setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    } catch (error) {
      toast.error("发送验证码失败，请重试！");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    toast.dismiss();
  
    if (!userId || !password) {
      toast.error("请填写账号和密码！");
      setIsLoading(false);
      return;
    }
  
    try {
      const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

      if (role === "学生") {
        const { access_token } = await loginUser(userId, hashedPassword);
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("id", userId);
      }else {
        if (!email || !code) {
          toast.error("请输入邮箱和验证码！");
          return;
        }
        const { access_token } = await loginTeacher(userId, hashedPassword, email, code);
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("id", userId);
      }

      if (remember) {
        localStorage.setItem("remember", "true");
      }
  
      toast.success("登录成功！3秒后自动跳转至主页...");
      setIsLoggedIn(true);

      setTimeout(() => {
        router.replace("/");
      }, 3000);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "登录失败，请检查账号和密码！");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-6 w-full" onSubmit={handleLogin}>
      <Input
        isRequired
        label="账号"
        name="userId"
        placeholder="请输入您的账号"
        type="text"
        variant="bordered"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        classNames={{
          input: "w-full",
          inputWrapper: "w-full"
        }}
      />
      <Select
        isRequired
        label="角色"
        placeholder="请选择您的角色"
        variant="bordered"
        selectedKeys={[role]}
        onSelectionChange={(keys) => {
          const selectedRole = Array.from(keys)[0] as string;
          setRole(selectedRole);
        }}
        classNames={{
          trigger: "w-full"
        }}
      >
        <SelectItem key="student">
          学生
        </SelectItem>
        <SelectItem key="teacher">
          教师
        </SelectItem>
      </Select>
      <Input
        isRequired
        label="密码"
        name="password"
        placeholder="请输入您的密码"
        type={isVisible ? "text" : "password"}
        variant="bordered"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        classNames={{
          input: "w-full",
          inputWrapper: "w-full"
        }}
        endContent={
          <button
            type="button"
            className="focus:outline-none"
            onClick={toggleVisibility}
          >
            {isVisible ? <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" /> : <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />}
          </button>
        }
      />
      {role === "teacher" && (
      <>
        <Input
          isRequired
          label="邮箱"
          placeholder="请输入您的邮箱"
          type="email"
          variant="bordered"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="flex gap-2 items-end">
          <Input
            isRequired
            label="验证码"
            placeholder="请输入验证码"
            type="text"
            variant="bordered"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <Button onClick={handleSendCode} disabled={!email || countdown>0}>
            {countdown > 0 ? `${countdown}s 后重试` : "发送验证码"}
          </Button>
        </div>
      </>
      )}

      <div className="flex items-center justify-between">
        <Checkbox
          isSelected={remember}
          onValueChange={setRemember}
          size="sm"
        >
          <span className="text-sm">记住账户与密码</span>
        </Checkbox>
        <Link href="#" color="primary" size="sm">
          忘记密码？
        </Link>
      </div>
      <Button color="primary" type="submit" className="w-full">
        登录
      </Button>
    </form>
  );
}

function RegisterForm({ setIsLoading }: { setIsLoading: (isLoading: boolean) => void }) {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("学生");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);
  const toggleConfirmPasswordVisibility = () => setIsConfirmPasswordVisible(!isConfirmPasswordVisible);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  
    // 检查密码和确认密码是否一致
    if (password !== confirmPassword) {
      toast.error("密码和确认密码不一致！");
      setIsLoading(false);
      return;
    }
  
    try {
      //哈希加密
      const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
      await createUser(userId, hashedPassword, email, role);  // 调用注册接口，传入角色
  
      toast.success("注册成功！请使用新账号自行登录！");
      setTimeout(() => {
        router.replace("/user");
      }, 3000);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "注册失败，请稍后再试！");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendCode = async () => {
    if (!email) {
      toast.error("请输入邮箱！");
      return;
    }
    try {
      const data = await sendEmailCode(email); // 调用后端接口，发送验证码
      if (data?.message) {
        toast.success(data.message); 
    } else {
        toast.success("验证码已发送，请查收邮箱！");
    }
        setIsCodeSent(true);
        setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    } catch (error) {
      toast.error("发送验证码失败，请重试！");
    }
  };

  return (
    <form className="flex flex-col gap-6 w-full" onSubmit={handleSubmit}>
      <Input
        isRequired
        label="账号"
        name="userId"
        placeholder="请输入您的账号"
        type="text"
        variant="bordered"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        classNames={{
          input: "w-full",
          inputWrapper: "w-full"
        }}
      />
      <Select
        isRequired
        label="角色"
        placeholder="请选择您的角色"
        variant="bordered"
        selectedKeys={[role]}
        onSelectionChange={(keys) => {
          const selectedRole = Array.from(keys)[0] as string;
          setRole(selectedRole);
        }}
        classNames={{
          trigger: "w-full"
        }}
      >
        <SelectItem key="student">
          学生
        </SelectItem>
        <SelectItem key="teacher">
          教师
        </SelectItem>
      </Select>
      <Input
        isRequired
        label="密码"
        name="password"
        placeholder="请输入您的密码（至少6位）"
        type={isPasswordVisible ? "text" : "password"}
        variant="bordered"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        classNames={{
          input: "w-full",
          inputWrapper: "w-full"
        }}
        endContent={
          <button
            type="button"
            className="focus:outline-none"
            onClick={togglePasswordVisibility}
          >
            {isPasswordVisible ? <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" /> : <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />}
          </button>
        }
      />
      <Input
        isRequired
        label="确认密码"
        name="confirmPassword"
        placeholder="确认您的密码"
        type={isConfirmPasswordVisible ? "text" : "password"}
        variant="bordered"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        classNames={{
          input: "w-full",
          inputWrapper: "w-full"
        }}
        endContent={
          <button
            type="button"
            className="focus:outline-none"
            onClick={toggleConfirmPasswordVisibility}
          >
            {isConfirmPasswordVisible ? <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" /> : <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />}
          </button>
        }
      />
      <Input
          isRequired
          label="邮箱"
          placeholder="请输入您的邮箱"
          type="email"
          variant="bordered"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="flex gap-2 items-end">
          <Input
            isRequired
            label="验证码"
            placeholder="请输入验证码"
            type="text"
            variant="bordered"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <Button onClick={handleSendCode} disabled={!email || countdown>0}>
            {countdown > 0 ? `${countdown}s 后重试` : "发送验证码"}
          </Button>
        </div>
      <Checkbox isRequired className="py-2">
        <span className="text-sm">
          我同意&nbsp;
          <Link href="#" color="primary" size="sm">
            服务条款
          </Link>
          &nbsp;和&nbsp;
          <Link href="#" color="primary" size="sm">
            隐私政策
          </Link>
        </span>
      </Checkbox>
      <Button color="primary" type="submit" className="w-full">
        注册
      </Button>
    </form>
  );
}