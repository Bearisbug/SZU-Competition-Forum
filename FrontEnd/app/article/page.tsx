"use client";

import { useState, useEffect, useCallback } from "react";
import { ArticleCard } from "@/components/Card/ArticleCard";
import { FilterSidebar } from "@/components/FilterSidebar";
import { Pagination, Spinner, Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { X } from 'lucide-react';
import { motion } from "framer-motion";
import { API_BASE_URL } from '@/CONFIG';
import { useAuthStore } from '@/components/AuthStore';

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
  post_type:string;
};

type FilterCategory = "category" | "date" | "author";
type FilterOption = { category: FilterCategory; label: string; value: string };

const filterCategories = [
  {
    title: "分类",
    category: "category" as FilterCategory,
    options: [
      { label: "科技", value: "technology" },
      { label: "科学", value: "science" },
      { label: "生活方式", value: "lifestyle" },
      { label: "商业", value: "business" },
    ],
  },
  {
    title: "时间范围",
    category: "date" as FilterCategory,
    options: [
      { label: "本周", value: "this-week" },
      { label: "本月", value: "this-month" },
      { label: "今年", value: "this-year" },
    ],
  },
  {
    title: "作者级别",
    category: "author" as FilterCategory,
    options: [
      { label: "初级", value: "beginner" },
      { label: "中级", value: "intermediate" },
      { label: "高级", value: "expert" },
    ],
  },
];

export default function ArticleListPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [filters, setFilters] = useState<FilterOption[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const articlesPerPage = 6;
  
  // 从 AuthStore 获取登录状态
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchArticles = useCallback(async () => {
    setIsLoading(true);
    try {
        const token = typeof window !== 'undefined' ? localStorage.getItem("access_token") || '' : '';
        const response = await fetch(`${API_BASE_URL}/api/articles/all`, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });

      if (!response.ok) {
        throw new Error("无法加载文章列表！");
      }

      const data = await response.json();
      setArticles(data);
      setFilteredArticles(data);
    } catch (error) {
      console.error("获取文章列表错误:", error);
      toast.error("加载文章列表失败，请稍后重试！");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleFilterChange = useCallback(
    (newFilters: FilterOption[], dateRange: string) => {
      setFilters(newFilters);
      setCurrentPage(1);

      let filtered = articles;

      if (newFilters.length > 0) {
        filtered = filtered.filter((article) =>
          newFilters.every((filter) => {
            switch (filter.category) {
              case "category":
                return article.category.toLowerCase() === filter.value;
              case "date":
                // TODO: 实现日期过滤逻辑
                return true;
              case "author":
                // TODO: 实现作者过滤逻辑
                return true;
              default:
                return true;
            }
          })
        );
      }

      setFilteredArticles(filtered);
    },
    [articles]
  );

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(
    indexOfFirstArticle,
    indexOfLastArticle
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen gap-4">
        <Spinner size="lg" color="primary" />
        <p>加载文章中...</p>
      </div>
    );
  }

  if (filteredArticles.length === 0) {
    return (
      <div className="container mx-auto p-4 flex" style={{ marginTop: mounted ? (isLoggedIn ? "114px" : "60px") : "60px" }}>
        <FilterSidebar
          //@ts-ignore
          onFilterChange={handleFilterChange}
          //@ts-ignore
          filterCategories={filterCategories}
        />
        <div className="flex-1 ml-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">文章列表</h1>
            <Button
              color="primary"
              onPress={() => router.push("/article/create")}
            >
              创建文章
            </Button>
          </div>
          <div className="flex flex-col items-center justify-center h-64">
            <X className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-center text-gray-500">
              未找到文章。尝试调整筛选条件或创建新文章。
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 flex" style={{ marginTop: mounted ? (isLoggedIn ? "114px" : "60px") : "60px" }}>
      <FilterSidebar
        //@ts-ignore
        onFilterChange={handleFilterChange}
        //@ts-ignore
        filterCategories={filterCategories}
      />
      <div className="flex-1 ml-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">文章列表</h1>
          <Button
            color="primary"
            onPress={() => router.push("/article/create")}
          >
            创建文章
          </Button>
        </div>
        <motion.div
          className="grid grid-cols-1 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {currentArticles.map((article, index) => (
            <motion.div
              key={article.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5 }}
              onClick={() => {
                if (article.post_type === 'share') {
                  router.push(`/article/${article.id}`);
                } else if (article.post_type === 'discussion') {
                  router.push(`/article/discussion/${article.id}`);
                } else {
                  toast.error("未知的文章类型！");
                }
              }}
              className="cursor-pointer"
            >
              <ArticleCard
                {...article}
                isAuthor={typeof window !== 'undefined' ? localStorage.getItem("id") == article.author_id : false}
              />
            </motion.div>
          ))}
        </motion.div>
        {filteredArticles.length > articlesPerPage && (
          <div className="mt-6 flex justify-center">
            <Pagination
              total={Math.ceil(filteredArticles.length / articlesPerPage)}
              initialPage={1}
              page={currentPage}
              onChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}

