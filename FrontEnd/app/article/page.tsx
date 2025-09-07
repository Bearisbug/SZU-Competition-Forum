"use client";

import { useState, useEffect, useCallback } from "react";
import { withAuth } from "@/lib/auth-guards";
import { ArticleCard } from "@/components/Card/ArticleCard";
import { FilterSidebar } from "@/components/FilterSidebar";
import { Spinner, Button, Input } from "@heroui/react";
import AppPagination from "@/components/Pagination";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { API_BASE_URL } from "@/CONFIG";
import { useAuthStore } from "@/lib/auth-guards";

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

function ArticleListPageContent() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [filters, setFilters] = useState<FilterOption[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const isAdmin = (role || "").toLowerCase() === "admin";
  const articlesPerPage = 6;
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setMounted(true);

    // 获取用户角色
    const fetchRole = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setRole(null);
        return;
      }

      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const uid = payload?.sub;
        if (!uid) {
          setRole(null);
          return;
        }

        const res = await fetch(`${API_BASE_URL}/api/user/info/${uid}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const user = await res.json();
          setRole(user?.role ?? null);
        } else {
          setRole(null);
        }
      } catch {
        setRole(null);
      }
    };

    fetchRole();
  }, []);

  const fetchArticles = useCallback(async () => {
    setIsLoading(true);
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("access_token") || ""
          : "";
      const response = await fetch(`${API_BASE_URL}/api/articles/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("无法加载文章列表！");

      const data = await response.json();

      // ✅ 关键：把后端返回的 author 嵌套拍平成 author_id/author_name，兼容你现有类型与逻辑
      const normalized = (data || []).map((a: any) => ({
        ...a,
        author_id: a?.author?.id ?? a?.author_id,
        author_name: a?.author?.name ?? a?.author_name,
        created_at: a?.created_at, // 保留原字段
      }));

      setArticles(normalized);
      setFilteredArticles(normalized);
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

      // 按文章标题搜索
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        filtered = filtered.filter((a) => String(a.title || "").toLowerCase().includes(q));
      }

      setFilteredArticles(filtered);
    },
    [articles, searchQuery]
  );

  useEffect(() => {
    // 搜索词变化时，重新应用筛选
    handleFilterChange(filters as any, "");
  }, [searchQuery]);

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
      <div
        className="container mx-auto p-4 flex"
        style={{
          marginTop: mounted ? (isLoggedIn ? "114px" : "60px") : "60px",
        }}
      >
        <FilterSidebar
          //@ts-ignore
          onFilterChange={handleFilterChange}
          //@ts-ignore
          filterCategories={filterCategories}
        />
        <div className="flex-1 ml-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-6">
            <h1 className="text-2xl font-bold">文章列表</h1>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Input
                placeholder="搜索文章标题..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="md:w-80"
              />
              <Button
                color="primary"
                onPress={() => router.push("/article/create")}
              >
                创建文章
              </Button>
            </div>
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
    <div
      className="container mx-auto p-4 flex"
      style={{ marginTop: mounted ? (isLoggedIn ? "114px" : "60px") : "60px" }}
    >
      <FilterSidebar
        //@ts-ignore
        onFilterChange={handleFilterChange}
        //@ts-ignore
        filterCategories={filterCategories}
      />
      <div className="flex-1 ml-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-6">
          <h1 className="text-2xl font-bold">文章列表</h1>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Input
              placeholder="搜索文章标题..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="md:w-80"
            />
            <Button
              color="primary"
              onPress={() => router.push("/article/create")}
            >
              创建文章
            </Button>
          </div>
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
              className="relative"
            >
              <div
                className="cursor-pointer"
                onClick={() => {
                    router.push(`/article/${article.id}`);
                }}
              >
                <ArticleCard
                  {...article}
                  isAuthor={
                    typeof window !== "undefined" &&
                    String(localStorage.getItem("id") ?? "") ===
                      String(article.author_id ?? "")
                  }
                  isAdmin={isAdmin}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
        {filteredArticles.length > articlesPerPage && (
          <div className="mt-6 flex justify-center">
            <AppPagination
              total={Math.ceil(filteredArticles.length / articlesPerPage)}
              page={currentPage}
              onChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// 使用登录校验高阶组件包装原始组件
const ArticleListPage = withAuth(ArticleListPageContent);
export default ArticleListPage;
