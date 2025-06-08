'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Search, MessageCircle, Trophy, Users, BookOpen } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { API_BASE_URL } from "@/CONFIG";

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

export default function HomePage() {
  const router = useRouter();

  const [articles, setArticles] = useState<Article[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const visibleCount = 3;

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/articles/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      if (!res.ok) throw new Error("获取文章列表失败");

      const data = await res.json();
      const formatted: Article[] = data
        .filter((item: any) => item.post_type === "discussion")
        .map((item: any) => ({
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

  const handleTeamClick = () => router.push('/teams');
  const handleArticleClick = () => router.push('/article');

  return (
    <div className="min-h-screen bg-gray-50 mt-12">

      {/* 顶部标题卡片 */}
      <header className="text-center relative overflow-hidden min-h-[700px] w-full p-8">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/e.png"
            alt="背景图"
            fill
            className="object-cover object-center opacity-20"
          />
          <div className="absolute inset-100 bg-white/10" />
        </div>

        <div className="relative z-10 text-center mb-12 mt-16">
          <h1 className="text-5xl font-bold text-blue-900 mb-3">互动交流</h1>
          <div className="flex justify-center mb-10">
            <div className="w-48 h-1.5 bg-blue-900"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div onClick={handleArticleClick} className="p-8 cursor-pointer">
            <div className="flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="text-blue-800 w-10 h-10" />
            </div>
              <h3 className="text-2xl font-bold text-blue-800 mb-3">技术讨论</h3>
            </div>

            <div onClick={handleArticleClick} className="p-8 cursor-pointer">
              <div className="flex items-center justify-center mx-auto mb-6">
              <Trophy className="text-blue-800 w-10 h-10" />
            </div>
              <h3 className="text-2xl font-bold text-blue-800 mb-3">竞赛经验分享</h3>
            </div>

            <div onClick={handleTeamClick} className="p-8 cursor-pointer">
              <div className="flex items-center justify-center mx-auto mb-6">
              <Users className="text-blue-800 w-10 h-10" />
            </div>
              <h3 className="text-2xl font-bold text-blue-800 mb-3">组建团队</h3>
            </div>

            <div onClick={handleArticleClick} className="p-8 cursor-pointer">
              <div className="flex items-center justify-center mx-auto mb-6">
              <BookOpen className="text-blue-800 w-10 h-10" />
            </div>
              <h3 className="text-2xl font-bold text-blue-800 mb-3">学习心得</h3>
            </div>
          </div>
        </div>
      </header>

      {/* 下方内容区：最新分享帖子展示 */}
      <div className="relative bg-cover bg-center pt-12 pb-20" style={{ backgroundImage: "url('/bg2.png')" }}>
        <div className="absolute inset-0 bg-[#024d8f] opacity-60 pointer-events-none" />
        <div className="relative container mx-auto px-4">
          <div className="max-w-6xl mx-auto mb-12 relative text-center">
            <h2 className="inline-block text-3xl font-bold text-white border-b-4 border-white pb-2">最新帖子</h2>
            <div className="absolute top-0 right-[-200px] flex items-center gap-2 bg-white rounded-full px-4 py-1 shadow-md w-full max-w-xs" style={{ height: "40px" }}>
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

          <div className="relative max-w-6xl mx-auto mt-12">
            <button
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className="absolute left-[-160px] top-1/2 -translate-y-1/2 z-20 w-24 h-64 flex items-center justify-center text-white disabled:opacity-30 p-0"
            >
              <ChevronLeft size={100} />
            </button>
            <button
              onClick={nextSlide}
              disabled={currentIndex === maxIndex}
              className="absolute right-[-160px] top-1/2 -translate-y-1/2 z-20 w-24 h-64 flex items-center justify-center text-white disabled:opacity-30 p-0"
            >
              <ChevronRight size={100} />
            </button>

            <div className="overflow-hidden px-12">
              <div className="flex gap-6 transition-all duration-300">
                {filteredArticles
                  .slice(currentIndex, currentIndex + visibleCount)
                  .map((article) => (
                    <div
                      key={article.id}
                      className="w-1/3 px-2 flex-shrink-0 cursor-pointer"
                      onClick={() => router.push(`/article/discussion/${article.id}`)}
                    >
                      <Card className="shadow-md hover:shadow-xl transition-shadow duration-300">
                        <CardContent className="p-0">
                          <img
                            src={article.cover_image}
                            alt={article.title}
                            className="w-full h-40 object-cover rounded-t-md"
                          />
                          <div className="p-6">
                            <h3 className="text-xl font-bold mb-3">{article.title}</h3>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-3">{article.summary}</p>
                            <div className="flex justify-between items-center mt-4">
                              <span className="text-sm text-gray-500">作者：{article.author_name}</span>
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
