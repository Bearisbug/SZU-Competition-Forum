"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Link, Spinner, Button } from "@heroui/react";
import toast from "react-hot-toast";
import { Calendar, Eye, GraduationCap, Briefcase, CircleUserRound, ThumbsUp, Share2 } from 'lucide-react';
import { API_BASE_URL } from "@/CONFIG";
import { ArrowLeft } from 'lucide-react';

// 强制动态渲染
export const dynamic = 'force-dynamic';

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
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  // 文章点赞数和点赞状态
  const [likes, setLikes] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`likes-${id}`);
      return saved ? parseInt(saved) : 0;
    }
    return 0;
  });

  const [hasLiked, setHasLiked] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(`hasLiked-${id}`) === 'true';
    }
    return false;
  });

  // 点赞功能 - 每个账号只能点一次
  const handleLike = () => {
    if (hasLiked) {
      toast.error("您已经点过赞了！");
      return;
    }
    
    const newLikes = likes + 1;
    setLikes(newLikes);
    setHasLiked(true);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(`likes-${id}`, newLikes.toString());
      localStorage.setItem(`hasLiked-${id}`, 'true');
    }
    
    toast.success("点赞成功！");
  };

  // 分享功能 - 复制链接到剪切板
  const handleShare = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      toast.success("链接已复制到剪切板！");
    } catch (error) {
      console.error("复制失败:", error);
      toast.error("复制失败，请手动复制链接");
    }
  };


      useEffect(() => {
        const fetchArticle = async () => {
          try {
            const response = await fetch(`${API_BASE_URL}/api/articles/detail/${id}`, {
              headers: {
                Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem("access_token") : ''}`,
              },
            });

            if (!response.ok) {
              throw new Error("无法加载文章详情！");
            }

            const articleData = await response.json();
            setArticle(articleData);
          } catch (error) {
            console.error("加载文章详情错误:", error);
            toast.error("加载文章失败，请稍后重试！");
          }
        };

        fetchArticle();
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
    <div className="relative min-h-screen mt-20">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-20">
        <div className="flex justify-end items-center gap-4">
          <Button 
            variant={hasLiked ? "solid" : "light"} 
            color={hasLiked ? "primary" : "default"}
            startContent={<ThumbsUp className="w-5 h-5" />} 
            onPress={handleLike}
            disabled={hasLiked}
          >
            {hasLiked ? "已点赞" : "点赞"} {likes}
          </Button>
          <Button 
            variant="light" 
            startContent={<Share2 className="w-5 h-5" />}
            onPress={handleShare}
          >
            分享
          </Button>
        </div>
      </div>
      <Button
        onPress={() => router.push("/article")}
        className="fixed top-36 left-6 z-50 text-[#024d8f] font-bold border-none shadow-none hover:bg-white/10 text-xl"
        variant="ghost"
      >
        <ArrowLeft className="w-5 h-5" />
        返回上一级
      </Button>

      {/* 全页背景图 */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/bg3.png')" }}
      />
      
      {/* 半透明遮罩层 */}
      <div className="fixed inset-0 z-1 bg-white/50" />
      

      {/* 全局内容区域 */}
      <div className="relative z-10 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 主内容区域 */}
          <div className="flex flex-col md:flex-row gap-8">
            {/* 左侧作者信息 */}
            <div className="w-full md:w-1/4 lg:w-1/3">
              {/* Sticky 容器 */}
              <div className="sticky top-20">
                {/* 作者信息卡片 */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex flex-col items-center">
                    <img
                      src={article.author.avatar_url || "https://via.placeholder.com/100"}
                      alt="作者头像"
                      className="w-24 h-24 rounded-full mb-4"
                    />
                    <Link 
                      href={`/user/${article.author.id}`} 
                      className="text-lg font-bold text-gray-800 hover:text-primary mb-2"
                    >
                      {article.author.name}
                    </Link>
                    <div className="w-full space-y-3 mt-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <GraduationCap className="w-4 h-4 mr-2 text-gray-500" />
                        <span>年级: {article.author.grade || "未知"}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Briefcase className="w-4 h-4 mr-2 text-gray-500" />
                        <span>专业: {article.author.major || "未知"}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CircleUserRound className="w-4 h-4 mr-2 text-gray-500" />
                        <span>角色: {article.author.role || "未知"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* 右侧文章内容 */}
            <div className="w-full md:w-3/4 lg:w-4/5">
              <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
                {/* 文章标题 */}
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{article.title}</h1>
                
                {/* 文章元信息 */}
                <div className="flex items-center text-sm text-gray-500 mb-6 space-x-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{new Date(article.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    <span>阅读 {article.view_count}</span>
                  </div>
                </div>

                {/* 文章摘要 */}
                {article.summary && (
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                    <p className="text-gray-700 italic">{article.summary}</p>
                  </div>
                )}

                {/* 文章内容 */}
                <div 
                  className="prose max-w-none text-gray-800"
                  dangerouslySetInnerHTML={{ __html: article.content }} 
                />

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}