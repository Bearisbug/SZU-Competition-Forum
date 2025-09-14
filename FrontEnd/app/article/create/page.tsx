"use client";

import { useState, useEffect } from "react";
import { withAuth } from "@/lib/auth-guards";
import { useRouter } from "next/navigation";
import { Input, Button, Textarea, Select, SelectItem } from "@heroui/react";
import MyEditor from "@/components/IOEditor";
import toast from "react-hot-toast";
import { API_BASE_URL } from "@/CONFIG";

function CreateArticlePageContent() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [coverPreview, setCoverPreview] = useState("");
  // 移除帖子类型

  // 上传图片并更新预览和 URL
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      toast.error("请选择图片文件！");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(`${API_BASE_URL}/upload_image`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "上传图片失败！");
      }

      const result = await response.json();
      const imageUrl = result.data.url;

      setCoverImage(imageUrl); // 更新图片 URL
      setCoverPreview(URL.createObjectURL(file)); // 更新本地预览
      toast.success("图片上传成功！");
    } catch (error) {
      console.error("图片上传错误:", error);
      toast.error("上传图片失败，请重试！");
    }
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !summary || !content || !category || !coverImage) {
      toast.error("请填写所有必填字段！");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/articles/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem("access_token") : ''}`, // 根据后端认证需求设置
        },
        body: JSON.stringify({
          title,
          summary,
          content,
          category,
          cover_image: coverImage,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "创建文章失败！");
      }

      toast.success("文章创建成功！");
      router.push("/article/"); // 创建成功后跳转到主页或文章列表页
    } catch (error) {
      console.error("创建文章错误:", error);
      toast.error("创建文章失败，请重试！");
    }
  };

  const [mounted, setMounted] = useState(false);
  
  // 从 AuthStore 获取登录状态
  const isLoggedIn = true; // 已登录页面必定是登录状态
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  return (
    <div className="flex-1 min-h-0 container mx-auto p-4 w-3/5">
      <h1 className="text-2xl font-bold mb-4">创建新文章</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="文章标题"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <Textarea
          label="文章简介"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          required
        />
        <Select
          label="文章分类"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <SelectItem key="备赛攻略">备赛攻略</SelectItem>
          <SelectItem key="技术指南">技术指南</SelectItem>
          <SelectItem key="心得体会">心得体会</SelectItem>
          <SelectItem key="组队招募">组队招募</SelectItem>
        </Select>
        <div>
          <label className="block mb-2">封面图片</label>
          {coverPreview && (
            <img
              src={coverPreview}
              alt="封面预览"
              className="mb-2 w-32 h-32 object-cover border"
            />
          )}
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
          {coverImage && (
            <p className="text-sm text-gray-500">上传成功的 URL: {coverImage}</p>
          )}
        </div>
        <div>
          <label className="block mb-2">文章内容</label>
          <MyEditor initialValue={content} onChange={setContent} />
        </div>
        <Button type="submit" color="primary">
          提交文章
        </Button>
      </form>
    </div>
  );
}

// 使用登录校验高阶组件包装原始组件
const CreateArticlePage = withAuth(CreateArticlePageContent);
export default CreateArticlePage;
