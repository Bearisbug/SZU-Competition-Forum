"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input, Button, Textarea, Select, SelectItem } from "@heroui/react";
import MyEditor from "@/components/IOEditor";
import toast from "react-hot-toast";
import { API_BASE_URL } from "@/CONFIG";

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [coverPreview, setCoverPreview] = useState("");
  const [postType, setPostType] = useState("");

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/articles/detail/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("文章加载失败！");
        }

        const article = await response.json();
        setTitle(article.title);
        setSummary(article.summary);
        setContent(article.content);
        setCategory(article.category);
        setCoverImage(article.cover_image);
        setCoverPreview(article.cover_image);
        setPostType(article.post_type)

        toast.success("文章加载成功！");
      } catch (error) {
        console.error("加载文章错误:", error);
        toast.error("文章加载失败，请稍后重试！");
      }
    };

    fetchArticle();
  }, [id]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !summary || !content || !category) {
      toast.error("请填写所有必填字段！");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/articles/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`, // 根据后端认证需求设置
        },
        body: JSON.stringify({
          title,
          summary,
          content,
          category,
          cover_image: coverImage,
          post_type: postType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "更新文章失败！");
      }

      toast.success("文章更新成功！");
      router.push(`/articles/detail/${id}`);
    } catch (error) {
      console.error("更新文章错误:", error);
      toast.error("更新文章失败，请重试！");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">编辑文章</h1>
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
          <SelectItem key="technology">科技</SelectItem>
          <SelectItem key="science">科学</SelectItem>
          <SelectItem key="lifestyle">生活方式</SelectItem>
        </Select>
                <Select  
            label="帖子类型"  
            value={postType}  
            onChange={(e) => setPostType(e.target.value)}  
            required  
          >  
            <SelectItem key="share">分享帖</SelectItem>  
            <SelectItem key="discussion">交流帖</SelectItem>  
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
        <div className="flex justify-end space-x-4">
          <Button color="danger" onClick={() => router.push(`/articles/detail/${id}`)}>
            取消
          </Button>
          <Button type="submit" color="primary">
            更新文章
          </Button>
        </div>
      </form>
    </div>
  );
}