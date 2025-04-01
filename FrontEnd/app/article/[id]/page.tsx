"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Link, Spinner } from "@heroui/react";
import toast from "react-hot-toast";
import { Calendar, Eye, GraduationCap, Briefcase, User, CircleUserRound } from 'lucide-react';

type Author = {
  id: number;
  name: string;
  grade: string | null;
  major: string | null;
  avatar_url: string | null;
  role: string | null;
};

type Article = {
  id: number;
  title: string;
  summary: string;
  content: string;
  cover_image: string;
  category: string;
  view_count: number;
  created_at: string;
  author: Author;
};

export default function ArticleDetailPage() {
  const [article, setArticle] = useState<Article | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/articles/detail/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("无法加载文章详情！");
        }

        const articleData = await response.json();
        setArticle(articleData);
        // toast.success("文章加载成功！");
      } catch (error) {
        console.error("加载文章详情错误:", error);
        toast.error("加载文章失败，请稍后重试！");
      }
    };

    fetchArticle();

    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [id]);

  if (!article) {
    return (
      <div className="flex justify-center items-center h-screen gap-4">
        <Spinner size="lg" color="primary" />
        <p>加载文章中...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-100">
      {/* 背景封面图片 */}
      <div
        className="fixed inset-0 z-0"
        style={{
          opacity: Math.max(0, 1 - scrollPosition / 500),
        }}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${article.cover_image || "https://via.placeholder.com/1920x1080"})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80" />
      </div>

      {/* 内容区域 */}
      <div className="relative z-10">
        {/* 标题区 */}
        <div className="h-screen flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white drop-shadow-md px-4 text-center">{article.title}</h1>
        </div>

        {/* 文章内容 */}
        <div className="w-full flex-col flex items-center">
          <div className="prose bg-white/90 text-black w-full max-w-3xl mx-auto px-4 sm:px-6 md:px-8 pt-8 mt-64 rounded-lg shadow-lg">
            <p className="text-lg font-medium mb-4">{article.summary}</p>
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
            <div className="mt-6 flex justify-between items-center">
              <p className="text-sm text-gray-500 pr-2 mb-6 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date(article.created_at).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500 mb-6 flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                浏览量: {article.view_count}
              </p>
            </div>
          </div>
          {/* 作者卡片 */}
          <div className="w-full max-w-3xl bg-white mt-8 p-6 rounded-lg shadow-md flex items-center mb-4 mx-auto">
            <img
              src={article.author.avatar_url || "https://via.placeholder.com/100"}
              alt="作者头像"
              className="w-16 h-16 rounded-full"
            />
            <div className="ml-4">
              <Link href={`/user/${article.author.id}`} color="foreground" className="text-lg font-bold flex items-center">
                <User className="w-5 h-5 mr-2" />
                {article.author.name}
              </Link>
              <p className="text-sm text-gray-600 flex items-center">
                <GraduationCap className="w-4 h-4 mr-2" />
                年级: {article.author.grade || "未知"}
              </p>
              <p className="text-sm text-gray-600 flex items-center">
                <Briefcase className="w-4 h-4 mr-2" />
                专业: {article.author.major || "未知"}
              </p>
              <p className="text-sm text-gray-600 flex items-center">
                <CircleUserRound className="w-4 h-4 mr-2" />
                角色: {article.author.role || "未知"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

