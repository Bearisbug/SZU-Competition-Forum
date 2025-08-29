"use client";

import React from "react";

/**
 * 原页面代码已注释
 * 
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { API_BASE_URL } from "@/CONFIG";
import { useAuthStore } from '@/lib/auth-guards';

type Article = {
  id: number;
  title: string;
  summary: string;
  content: string;
  cover_image: string;
  category: string;
  view_count: number;
  created_at: string;
  author_name: string;
  author_id: string;
  post_type: string;
};

export default function Resource() {
  const images = [
    { src: "/1.png", text: "竞赛资源" },
    { src: "/1.png", text: "文献资料" },
    { src: "/1.png", text: "编程工具" },
  ];

  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleCount = 3;
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // 从 AuthStore 获取登录状态
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem("access_token") || '' : '';
      const res = await fetch(`${API_BASE_URL}/api/articles/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("获取文章列表失败");

      //过滤出分享帖！
      const data = await res.json();
      const formatted: Article[] = data.filter((item: any) => item.post_type === "share").map((item: any) => ({
        id: item.id,
        title: item.title,
        summary: item.summary || item.content.slice(0, 100),
        content: item.content,
        cover_image: item.cover_image || "/bg1.png",
        category: item.category || "未分类",
        view_count: item.view_count || 0,
        created_at: item.created_at,
        author_name: item.author_name || item.author?.username || "未知作者",
        author_id: item.author_id || item.author?.id || "",
        post_type: item.post_type,
      }));

      setArticles(formatted);
    } catch (error) {
      console.error(error);
      toast.error("加载文章失败，请稍后重试");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const maxIndex = Math.max(filteredArticles.length - visibleCount, 0);

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ marginTop: mounted ? (isLoggedIn ? "114px" : "60px") : "60px" }}>
      // 上方标题区
      <div className="bg-white py-8 shadow-md">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-2 text-[#024d8f] inline-block pb-2 border-b-4 border-[#024d8f]">
            资源共享
          </h1>

          // 分类图标卡片
          <div className="flex justify-center gap-8 mt-8">
            {images.map((image, index) => (
              <Card
                key={index}
                className="w-48 h-48 overflow-hidden relative group cursor-pointer"
                onClick={() => router.push("/article")}
              >
                <img
                  src={image.src}
                  alt={image.text}
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-[#024d8f] bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                  <span className="text-white text-xl font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    {image.text}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      // 下方内容区
      <div
        className="flex-1 bg-cover bg-center pt-12 pb-20 relative"
        style={{ backgroundImage: "url('/bg2.png')" }}
      >
        <div className="absolute inset-0 bg-[#024d8f] opacity-60 pointer-events-none"></div>
        <div className="relative container mx-auto px-4">
          // 标题与搜索框
          <div className="max-w-6xl mx-auto mb-12 relative text-center">
            <h2 className="inline-block text-3xl font-bold text-white border-b-4 border-white pb-2">
              最新帖子
            </h2>

            <div
              className="absolute top-0 right-[-200px] flex items-center gap-2 bg-white rounded-full px-4 py-1 shadow-md w-full max-w-xs"
              style={{ height: "40px" }}
            >
              <Search className="text-blue-700 w-5 h-5" />
              <Input
                type="text"
                placeholder="搜索关键词"
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentIndex(0);
                }}
              />
            </div>
          </div>

          // 帖子卡片区域
          <div className="relative max-w-6xl mx-auto mt-12">
            // 左右箭头
            <button
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className="absolute left-[-160px] top-1/2 -translate-y-1/2 z-20 w-24 h-64 flex items-center justify-center text-white disabled:opacity-30 p-0"
              aria-label="上一张"
            >
              <ChevronLeft size={100} />
            </button>
            <button
              onClick={nextSlide}
              disabled={currentIndex === maxIndex}
              className="absolute right-[-160px] top-1/2 -translate-y-1/2 z-20 w-24 h-64 flex items-center justify-center text-white disabled:opacity-30 p-0"
              aria-label="下一张"
            >
              <ChevronRight size={100} />
            </button>

            // 卡片区域（只渲染当前页）
            <div className="overflow-hidden px-12">
              <div className="flex gap-6 transition-all duration-300">
                {filteredArticles
                  .slice(currentIndex, currentIndex + visibleCount)
                  .map((article) => (
                    <div
                      key={article.id}
                      className="w-1/3 px-2 flex-shrink-0 cursor-pointer"
                      onClick={() => router.push(`/article/share/${article.id}`)}
                    >
                      <Card className="shadow-md hover:shadow-xl transition-shadow duration-300">
                        <CardContent className="p-0">
                          <img
                            src={article.cover_image}
                            alt={article.title}
                            className="w-full h-40 object-cover rounded-t-md"
                          />
                          <div className="p-6">
                            <h3 className="text-xl font-bold mb-3">
                              {article.title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                              {article.summary}
                            </p>
                            <div className="flex justify-between items-center mt-4">
                              <span className="text-sm text-gray-500">
                                作者：{article.author_name}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
*/

export default function Resource() {
  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-gradient-to-b from-white to-gray-100 overflow-hidden">
      <div className="w-full max-w-4xl mx-auto px-4 text-center">
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold tracking-wider text-[#024d8f] mb-4 drop-shadow-md">
            COMING SOON. . .
          </h1>
          <p className="text-xl md:text-2xl font-semibold text-[#024d8f] drop-shadow-sm">
            页面正在建设中. . .
          </p>
        </div>
      </div>
    </div>
  );
}
