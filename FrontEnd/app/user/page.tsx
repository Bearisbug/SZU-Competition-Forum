"use client";
import React, { useState } from "react";
import crypto from "crypto"; // 重新引入 crypto 用于前端哈希
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

// --- API 请求函数 ---

const registerStudent = async (userId: string, passwordHash: string) => {
  const response = await fetch(`${API_BASE_URL}/api/user/register/student`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: parseInt(userId), password: passwordHash }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.detail || '注册失败，请稍后再试！');
  }
  return response.json();
};

const loginStudent = async (userId: string, passwordHash: string): Promise<{ access_token: string }> => {
  const response = await fetch(`${API_BASE_URL}/api/user/login/student`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: parseInt(userId), password: passwordHash }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.detail || '登录失败，请检查学号和密码！');
  }
  return response.json();
};

const loginTeacher = async (email: string, code: string): Promise<{ access_token: string }> => {
  const response = await fetch(`${API_BASE_URL}/api/user/login/teacher`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.detail || '登录失败，请检查邮箱和验证码！');
  }
  return response.json();
};

const sendEmailCode = async (email: string) => {
  const res = await fetch(`${API_BASE_URL}/api/user/send-email-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.detail || "发送失败");
  }
  return data;
}

// --- 主页面组件 ---

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  const toggleTab = () => {
    setActiveTab(activeTab === "login" ? "register" : "login");
  };

  return (
    <div className="flex-1 min-h-0 w-full flex items-center justify-center bg-gray-100 px-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          <Card className="p-6 shadow-lg rounded-lg">
            <CardBody className="gap-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <h1 className="text-2xl font-semibold text-gray-800">
                  {activeTab === "login" ? "欢迎回来" : "注册学生账号"}
                </h1>
                <p className="text-sm text-gray-600">
                  {activeTab === "login"
                    ? "登录您的账户以继续"
                    : "欢迎你的加入！"}
                </p>
              </div>

              {activeTab === "login" ? (
                <LoginForm />
              ) : (
                <RegisterForm toggleTab={toggleTab} />
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

// --- 登录表单组件 ---

function LoginForm() {
  const router = useRouter();
  const [role, setRole] = useState("student");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [remember, setRemember] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [sending, setSending] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSendCode = async () => {
    if (!email) {
      toast.error("请输入教师邮箱！");
      return;
    }
    // 仅控制本地发送状态，避免卸载表单导致数据丢失
    setSending(true);
    try {
      const data = await sendEmailCode(email);
      toast.success(data.message || "验证码已发送，请查收邮箱！");
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
      toast.error(error instanceof Error ? error.message : "发送验证码失败，请重试！");
    } finally {
      setSending(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    toast.dismiss();

    try {
      let access_token: string;
      if (role === "student" || role === "admin") { // 管理员也使用此方式登录
        if (!userId || !password) {
          toast.error("请填写学号和密码！");
          setSubmitting(false);
          return;
        }
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        const data = await loginStudent(userId, hashedPassword);
        access_token = data.access_token;
        localStorage.setItem("id", userId);
      } else { // Teacher login
        if (!email || !code) {
          toast.error("请输入邮箱和验证码！");
          setSubmitting(false);
          return;
        }
        const data = await loginTeacher(email, code);
        access_token = data.access_token;
        // 解析 token，保存 user id，确保跨页面鉴权
        try {
          const payload = JSON.parse(atob(access_token.split(".")[1]));
          const uid = String(payload?.sub ?? "");
          if (uid) {
            localStorage.setItem("id", uid);
          }
        } catch {}
      }

      localStorage.setItem("access_token", access_token);
      if (remember) {
        localStorage.setItem("remember", "true");
      }

      toast.success("登录成功！即将跳转至主页...");
      setIsLoggedIn(true);

      setTimeout(() => {
        router.replace("/");
      }, 2000);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "登录失败，请检查您的输入！");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="flex flex-col gap-6 w-full" onSubmit={handleLogin}>
      <Select
        isRequired
        label="角色"
        placeholder="请选择您的角色"
        variant="bordered"
        selectedKeys={[role]}
        onSelectionChange={(keys) => setRole(Array.from(keys)[0] as string)}
      >
        <SelectItem key="student">学生</SelectItem>
        <SelectItem key="teacher">教师</SelectItem>
        <SelectItem key="admin">管理员</SelectItem>
      </Select>

      {(role === "student" || role === "admin") ? (
        <>
          <Input
            isRequired
            label="账号"
            name="userId"
            placeholder="请输入您的学号或管理员账号"
            type="text"
            variant="bordered"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <Input
            isRequired
            label="密码"
            name="password"
            placeholder="请输入您的密码"
            type={isVisible ? "text" : "password"}
            variant="bordered"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            endContent={
              <button type="button" className="focus:outline-none" onClick={toggleVisibility}>
                {isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            }
          />
        </>
      ) : (
        <>
          <Input
            isRequired
            label="教师邮箱"
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
            <Button type="button" onClick={handleSendCode} disabled={!email || countdown > 0 || sending}>
              {countdown > 0 ? `已发送 (${countdown}s)` : (sending ? "发送中..." : "发送验证码")}
            </Button>
          </div>
        </>
      )}

      <div className="flex items-center justify-between">
        <Checkbox isSelected={remember} onValueChange={setRemember} size="sm">
          记住我
        </Checkbox>
        <Link href="#" color="primary" size="sm">
          忘记密码？
        </Link>
      </div>
      <Button color="primary" type="submit" className="w-full" isDisabled={submitting}>
        {submitting ? "登录中..." : "登录"}
      </Button>
    </form>
  );
}

// --- 注册表单组件 ---

function RegisterForm({ toggleTab }: { toggleTab: () => void }) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);
  const toggleConfirmPasswordVisibility = () => setIsConfirmPasswordVisible(!isConfirmPasswordVisible);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("两次输入的密码不一致！");
      return;
    }
    setSubmitting(true);
    try {
      const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
      await registerStudent(userId, hashedPassword);
      toast.success("注册成功！现在您可以登录了。");
      setTimeout(() => {
        toggleTab(); // 切换到登录页
      }, 2000);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "注册失败，请稍后再试！");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="flex flex-col gap-6 w-full" onSubmit={handleSubmit}>
      <Input
        isRequired
        label="学号"
        name="userId"
        placeholder="请输入您的学号"
        type="text"
        variant="bordered"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <Input
        isRequired
        label="密码"
        name="password"
        placeholder="请输入您的密码（至少6位）"
        type={isPasswordVisible ? "text" : "password"}
        variant="bordered"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        endContent={
          <button type="button" className="focus:outline-none" onClick={togglePasswordVisibility}>
            {isPasswordVisible ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        }
      />
      <Input
        isRequired
        label="确认密码"
        name="confirmPassword"
        placeholder="请再次输入您的密码"
        type={isConfirmPasswordVisible ? "text" : "password"}
        variant="bordered"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        endContent={
          <button type="button" className="focus:outline-none" onClick={toggleConfirmPasswordVisibility}>
            {isConfirmPasswordVisible ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        }
      />
      <Checkbox isRequired defaultSelected>
        <span className="text-sm">
          我已阅读并同意&nbsp;
          <Link href="#" color="primary" size="sm">
            服务条款
          </Link>
        </span>
      </Checkbox>
      <Button color="primary" type="submit" className="w-full" isDisabled={submitting}>
        {submitting ? "注册中..." : "注册"}
      </Button>
    </form>
  );
}
