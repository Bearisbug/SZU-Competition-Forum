"use client";

import { useEffect, useState } from "react";
import { useParams,useRouter } from "next/navigation";
import { Link, Spinner, Button, Input } from "@heroui/react";
import toast from "react-hot-toast";
import { Calendar, Eye, GraduationCap, Briefcase, User, CircleUserRound, ThumbsUp, MessageSquare, Share2, Bookmark, Search } from 'lucide-react';
import { API_BASE_URL } from "@/CONFIG";
import { ArrowLeft } from 'lucide-react';


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
  const [searchTerm, setSearchTerm] = useState("");
  const { id } = params;

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/articles/detail/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
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
      <div className="relative w-full px-4 sm:px-6 lg:px-8 mb-6 z-10 flex justify-end items-center gap-4">
        <Button color="primary" onPress={() => router.push("/article/create")}>
          写文章
        </Button>
        <Input
          type="text"
          placeholder="搜索关键词"
          className="rounded-full px-3 py-1 text-sm focus-visible:ring-2 focus-visible:ring-blue-500 max-w-xs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          startContent={<Search className="w-4 h-4 text-blue-600" />}
        />
      </div>
      <Button
        onPress={() => router.push("/article")}
        className="fixed top-28 left-6 z-50 text-[#024d8f] font-bold border-none shadow-none hover:bg-white/10 text-xl"
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
      

      {/* 内容区域 */}
      <div className="relative z-10 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="w-full md:max-w-3xl">
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

                {/* 互动按钮区域 */}
                <div className="mt-12 pt-6 border-t border-gray-200 flex flex-wrap justify-between gap-4">
                  <Button variant="light" startContent={<ThumbsUp className="w-5 h-5" />}>
                    点赞
                  </Button>
                  <Button variant="light" startContent={<MessageSquare className="w-5 h-5" />}>
                    评论
                  </Button>
                  <Button variant="light" startContent={<Share2 className="w-5 h-5" />}>
                    分享
                  </Button>
                  <Button variant="light" startContent={<Bookmark className="w-5 h-5" />}>
                    收藏
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}