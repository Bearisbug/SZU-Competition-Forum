"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { withAuth } from "@/lib/auth-guards";
import {
  Card,
  CardBody,
  Avatar,
  Button,
  Input,
  Tooltip,
  Tab,
  Tabs,
  Spinner,
} from "@heroui/react";
import {
  Edit3,
  Check,
  X as XIcon,
  Mail,
  GraduationCap,
  BookOpenIcon,
  CameraIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { TeamCard, Team } from "@/components/Card/TeamCard";
import { ArticleCard } from "@/components/Card/ArticleCard";
import { API_BASE_URL } from "@/CONFIG";

export const dynamic = "force-dynamic";

interface User {
  id: number;
  name: string;
  email: string;
  avatar_url: string;
  grade: string;
  major: string;
  role: string;
}

interface Article {
  id: number;
  title: string;
  summary: string;
  category: string;
  cover_image: string;
  view_count: number;
  created_at: string;
}

type SidebarProps = {
  user: User;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (updatedUser: User) => void;
  isSelf: boolean;
};

const UserProfileSidebar: React.FC<SidebarProps> = ({
  user,
  onEdit,
  isEditing,
  onSave,
  isSelf,
}) => {
  const [editedUser, setEditedUser] = useState<User>(user);
  const [avatarPreview, setAvatarPreview] = useState<string>(""); // 初始化为空
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleNavigateProfile = () => {
    router.push(`/user/${user.id}`);
  };

  // 处理头像 URL
  const getFullAvatarUrl = (url: string) => {
    if (!url) return "";
    return url.startsWith("http") ? url : `${API_BASE_URL}/${url}`;
  };

  useEffect(() => {
    setEditedUser(user);
    setAvatarPreview(getFullAvatarUrl(user.avatar_url));
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(`${API_BASE_URL}/upload_image`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.errno === 0) {
        const fullUrl = getFullAvatarUrl(data.data.url);
        setEditedUser((prev) => ({
          ...prev,
          avatar_url: fullUrl,
        }));
        setAvatarPreview(fullUrl);
        toast.success("头像上传成功！");
      } else {
        toast.error("上传图片失败！");
      }
    } catch (error) {
      console.error("图片上传失败:", error);
      toast.error("上传图片出错！");
    }
  };

  const handleAvatarClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSave = () => onSave(editedUser);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-sm mx-auto overflow-hidden">
        <CardBody className="p-6">
          <div className="flex flex-col items-center">
            <div
              className={`relative ${isEditing ? "cursor-pointer" : "cursor-pointer"}`}
              onClick={isEditing ? handleAvatarClick : handleNavigateProfile}
              title={isEditing ? "点击上传头像" : "查看主页"}
            >
              <Avatar src={avatarPreview} className="w-32 h-32 rounded-full text-large mb-4" />
              {isEditing && (
                <Tooltip content="点击更改头像">
                  <div className="absolute bottom-2 right-2 bg-gray-700 rounded-full p-1">
                    <CameraIcon size={20} color="white" />
                  </div>
                </Tooltip>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
            {isEditing ? (
              <Input
                type="text"
                name="name"
                value={editedUser.name}
                onChange={handleInputChange}
                className="text-2xl font-bold text-center mb-2 w-full"
              />
            ) : (
              <h2 className="text-2xl font-bold text-center mb-2">{editedUser.name}</h2>
            )}
            <p className="text-default-500 text-center mb-4">{editedUser.role}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Mail size={18} />
              {isEditing ? (
                <Input
                  type="email"
                  name="email"
                  value={editedUser.email}
                  onChange={handleInputChange}
                  className="flex-grow"
                />
              ) : (
                <span className="truncate">{editedUser.email}</span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Tooltip content="年级" placement="bottom">
                <GraduationCap size={18} />
              </Tooltip>
              {isEditing ? (
                <Input
                  type="text"
                  name="grade"
                  value={editedUser.grade}
                  onChange={handleInputChange}
                  className="flex-grow"
                />
              ) : (
                <span>{editedUser.grade}</span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Tooltip content="专业" placement="bottom">
                <BookOpenIcon size={18} />
              </Tooltip>
              {isEditing ? (
                <Input
                  type="text"
                  name="major"
                  value={editedUser.major}
                  onChange={handleInputChange}
                  className="flex-grow"
                />
              ) : (
                <span>{editedUser.major}</span>
              )}
            </div>
          </div>

          {isSelf && (
            <div className="mt-6">
              <Button
                color={isEditing ? "success" : "primary"}
                variant="shadow"
                startContent={isEditing ? <Check size={18} /> : <Edit3 size={18} />}
                className="w-full"
                onPress={isEditing ? handleSave : onEdit}
              >
                {isEditing ? "保存信息" : "修改信息"}
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
    </motion.div>
  );
};


function ProfilePageContent() {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { userId } = useParams();
  const router = useRouter();

  const [teams, setTeams] = useState<Team[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoadingTeamsArticles, setIsLoadingTeamsArticles] = useState(true);

  const [role, setRole] = useState<string | null>(null);
  const isAdmin = (role || "").toLowerCase() === "admin";

  // 为了页面顶部间距（与导航条匹配）
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleEdit = () => setIsEditing((prev) => !prev);

  const handleSave = useCallback(
    async (updatedUser: User) => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/user/info/${userId}/update`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              typeof window !== "undefined" ? localStorage.getItem("access_token") : ""
            }`,
          },
          body: JSON.stringify(updatedUser),
        });

        if (!response.ok) {
          throw new Error("保存失败！");
        }
        const data = await response.json();
        setUser(data);
        toast.success("信息保存成功！");
        setIsEditing(false);
      } catch (err) {
        console.error("保存失败:", err);
        toast.error("保存失败！");
      }
    },
    [userId]
  );

  const fetchData = useCallback(async () => {
    setIsLoadingTeamsArticles(true);
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("access_token") : "";
      const [teamsResponse, articlesResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/user/teams/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/api/user/articles/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!teamsResponse.ok || !articlesResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const teamsData = await teamsResponse.json();
      const articlesData = await articlesResponse.json();

      // 后端可能返回两种结构：
      // 1) [{ team: {...}, members: [...] }, ...]
      // 2) 直接返回 Team 列表 [{ id, name, ... }, ...]
      const normalizedTeams: Team[] = (teamsData || []).map((item: any) => {
        const teamObj = item.team ?? item; // 兼容两种返回
        const rawReq = teamObj?.requirements ?? [];
        return {
          id: Number(teamObj?.id) || 0,
          name: teamObj?.name || "",
          description: teamObj?.description || "",
          goals: teamObj?.goals || "",
          requirements: Array.isArray(rawReq)
            ? rawReq.flatMap((req: string) => String(req).split("\n"))
            : String(rawReq).split("\n"),
          max_members: Number(teamObj?.max_members) || 0,
          members: Array.isArray(item.members) ? item.members : [],
        } as Team;
      });

      // 去重，避免相同 team.id 导致 React key 警告
      const dedupedTeams = Array.from(
        new Map(normalizedTeams.map((t) => [t.id, t])).values()
      );

      setTeams(dedupedTeams);
      setArticles(articlesData || []);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError("加载数据失败，请稍后重试！");
    } finally {
      setIsLoadingTeamsArticles(false);
    }
  }, [userId]);

  const fetchUser = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/info/${userId}`);
      if (!response.ok) throw new Error("User not found");
      const data = await response.json();
      setUser(data);
    } catch (err) {
      setError("用户不存在");
      toast.error("页面找不到，3 秒后自动返回主页...");
      setTimeout(() => router.push("/"), 3000);
    } finally {
      setLoading(false);
    }
  }, [userId, router]);

  const fetchRole = useCallback(async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    if (!token) {
      setRole(null);
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split(".")[1] || ""));
      const uid = payload?.sub;
      if (!uid) {
        setRole(null);
        return;
      }
      const res = await fetch(`${API_BASE_URL}/api/user/info/${uid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const me = await res.json();
        setRole((me?.role ?? "").toLowerCase());
      } else {
        setRole(null);
      }
    } catch {
      setRole(null);
    }
  }, []);

  useEffect(() => {
    fetchUser();
    fetchData();
    fetchRole();
  }, [fetchUser, fetchData, fetchRole]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Spinner size="lg" />
        <p className="mt-4 text-lg">加载中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <XIcon size={100} color="red" />
        <h1 className="text-2xl font-bold mt-4">{error}</h1>
      </div>
    );
  }

  if (!user) return null;

  const isSelf = String(userId) === String(localStorage.getItem("id"));
  const isLoggedIn = true; 

  return (
    <div
      className="min-h-screen bg-background p-4 md:p-8"
      style={{ marginTop: mounted ? (isLoggedIn ? "114px" : "60px") : "60px" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/3">
            <UserProfileSidebar
              user={user}
              onEdit={handleEdit}
              isEditing={isEditing}
              onSave={handleSave}
              isSelf={isSelf}
            />
          </div>

          <div className="flex-1">
            <Card className="w-full">
              <CardBody>
                <Tabs aria-label="Profile sections" fullWidth>
                  <Tab key="teams" title="我的队伍">
                    <div className="p-4">
                      <div className="grid grid-cols-1 gap-4">
                        {isLoadingTeamsArticles ? (
                          <Spinner />
                        ) : teams.length > 0 ? (
                          teams.map((team, idx) => (
                            <TeamCard
                              key={`${team.id}-${idx}`}
                              team={team}
                              members={team.members}
                              // 该页面仅展示，不在此做操作
                              onJoinTeam={async () => { toast.error("你没办法在此页面进行该操作！"); }}
                              onLeaveTeam={async () => { toast.error("你没办法在此页面进行该操作！"); }}
                              onUpdateTeam={async () => { toast.error("你没办法在此页面进行该操作！"); }}
                              onDisbandTeam={async () => { toast.error("你没办法在此页面进行该操作！"); }}
                              onRemoveMember={async () => { toast.error("你没办法在此页面进行该操作！"); }}
                              isAdmin={isAdmin}
                            />
                          ))
                        ) : (
                          <div className="flex flex-col items-center justify-center h-64">
                            <XIcon className="w-16 h-16 text-gray-400 mb-4" />
                            <p className="text-center text-gray-500">该用户没有加入任何队伍！</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Tab>

                  <Tab key="articles" title="我的文章">
                    <div className="p-4">
                      <div className="grid grid-cols-1 gap-4">
                        {isLoadingTeamsArticles ? (
                          <Spinner />
                        ) : articles.length > 0 ? (
                          articles.map((article) => (
                            <ArticleCard
                              key={article.id}
                              {...article}
                              // 在个人主页里，列表都是该用户的文章
                              isAuthor={true}
                              isAdmin={isAdmin}
                            />
                          ))
                        ) : (
                          <div className="flex flex-col items-center justify-center h-64">
                            <XIcon className="w-16 h-16 text-gray-400 mb-4" />
                            <p className="text-center text-gray-500">该用户没有发布任何文章！</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Tab>
                </Tabs>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

const ProfilePage = withAuth(ProfilePageContent);
export default ProfilePage;
