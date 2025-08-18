"use client";

import { useEffect, useState,useRef } from "react";
import { useParams,useRouter } from "next/navigation";
import { Link, Spinner, Button, Input, Textarea } from "@heroui/react";
import toast from "react-hot-toast";
import { Calendar, Eye, GraduationCap, Briefcase, User, CircleUserRound, ThumbsUp, MessageSquare, Share2, Bookmark, Search } from 'lucide-react';
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
type Reply = {
  id: number;
  author: string;
  content: string;
  created_at: string;
};

type Comment = {
  id: number;
  author: string;
  content: string;
  created_at: string;
  replies: Reply[];
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

      // 文章点赞数
      const [likes, setLikes] = useState(() => {
          if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(`likes-${id}`);
            return saved ? parseInt(saved) : 0;
          }
          return 0;
        });

      const handleLike = () => {
        const newLikes = likes + 1;
        setLikes(newLikes);
        if (typeof window !== 'undefined') {
          localStorage.setItem(`likes-${id}`, newLikes.toString());
        }
      };

       const [likesForComments, setLikesForComments] = useState<{ [key: number]: number }>(() => {
        // 从localStorage加载(后期可改数据库)
        if (typeof window !== 'undefined') {
          const savedLikes = localStorage.getItem(`comment-likes-${id}`);
          return savedLikes ? JSON.parse(savedLikes) : {};
        }
        return {};
      });

        // 点赞某条评论
        const handleCommentLike = (commentId: number) => {
          setLikesForComments(prev => {
            const newLikes = { ...prev };
            newLikes[commentId] = (newLikes[commentId] || 0) + 1;
            if (typeof window !== 'undefined') {
              localStorage.setItem(`comment-likes-${id}`, JSON.stringify(newLikes));
            }
            return newLikes;
          });
        };

      // 新增评论状态
      const commentInputRef = useRef<HTMLTextAreaElement>(null); 
      const handleCommentClick = () => {
        commentInputRef.current?.focus(); // 让评论框获得焦点
        commentInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); // 平滑滚动
      };

      //评论模拟
      const [comments, setComments] = useState<Comment[]>([
        {
          id: 1,
          author: "张三",
          content: "这篇文章写得很好！",
          created_at: "2025-05-29 12:00",
          replies: [],
        },
        {
          id: 2,
          author: "李四",
          content: "666",
          created_at: "2025-05-29 12:15",
          replies: [],
        },
        {
          id: 3,
          author: "王五",
          content: "强啊大佬",
          created_at: "2025-05-29 12:05",
          replies: [],
        },
        {
          id: 4,
          author: "cyx",
          content: "这个页面很不错",
          created_at: "2025-05-29 13:22",
          replies: [],
        },
      ]);

      //新增回复状态
      const [replyingToId, setReplyingToId] = useState<number | null>(null);
      const [replyContent, setReplyContent] = useState("");
      //点击回复直接光标聚焦评论框
      const replyInputRef = useRef<HTMLTextAreaElement>(null);

      //实现回复功能
      const handleAddReply = (parentId: number) => {
      if (replyContent.trim() === "") return;
      const newReply = {
        id: Date.now(), // 用时间戳模拟唯一id
        author: "游客",
        content: replyContent.trim(),
        created_at: new Date().toLocaleString(),
      };
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === parentId
            ? { ...comment, replies: [...comment.replies, newReply] }
            : comment
        )
      );
      setReplyContent("");
      setReplyingToId(null);
    };

      const [newComment, setNewComment] = useState("");
      const commentEndRef = useRef<HTMLDivElement>(null);

      const addComment = () => {
        if (newComment.trim() === "") return;
        const comment: Comment = {
            id: comments.length + 1,
            author: "游客",
            content: newComment.trim(),
            created_at: new Date().toLocaleString(),
            replies: [], 
          };

        setComments([...comments, comment]);
        setNewComment("");
        // 滚动到底部
        setTimeout(() => {
          commentEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
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
                {/* Sticky 容器包住所有卡片 */}
                <div className="space-y-6 sticky top-20">
                  
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

                  {/* 作者相关文章 */}
                  <div className="bg-white rounded-lg shadow-md p-4">
                    <h3 className="text-lg font-semibold mb-3" style={{ color: "#024d8f" }}>作者相关文章</h3>
                    <ul className="space-y-4 text-sm text-blue-700">
                      <li><Link href="#">如何写好一篇技术博客</Link></li>
                      <li><Link href="#">前端性能优化实战</Link></li>
                      <li><Link href="#">React 状态管理方案比较</Link></li>
                    </ul>
                  </div>

                  {/* 分类专栏 */}
                  <div className="bg-white rounded-lg shadow-md p-4">
                    <h3 className="text-lg font-semibold mb-3" style={{ color: "#024d8f" }}>分类专栏</h3>
                    <ul className="space-y-4 text-sm text-blue-700">
                      <li><Link href="#">前端开发</Link></li>
                      <li><Link href="#">技术分享</Link></li>
                      <li><Link href="#">项目实战</Link></li>
                    </ul>
                  </div>

                   {/* 目录 */}
                  <div className="bg-white rounded-lg shadow-md p-4">
                    <h3 className="text-lg font-semibold mb-3" style={{ color: "#024d8f" }}>目录</h3>
                    <ul className="space-y-4 text-sm text-blue-700">
                      <li><Link href="#">前端开发</Link></li>
                      <li><Link href="#">技术分享</Link></li>
                      <li><Link href="#">项目实战</Link></li>
                    </ul>
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

                {/* 互动按钮区域 */}
                <div className="mt-12 pt-6 border-t border-gray-200 flex flex-wrap justify-between gap-4">
                  <Button variant="light" startContent={<ThumbsUp className="w-5 h-5" />} onPress={handleLike}>
                    点赞 {likes}
                  </Button>
                  <Button variant="light" startContent={<MessageSquare className="w-5 h-5" />} onPress={handleCommentClick}>
                    评论
                  </Button>
                  <Button variant="light" startContent={<Share2 className="w-5 h-5" />}>
                    分享
                  </Button>
                  <Button variant="light" startContent={<Bookmark className="w-5 h-5" />}>
                    收藏
                  </Button>
                </div>

                {/*评论区*/}
                <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mt-8 max-w-6xl mx-auto">
                  <h2 className="text-2xl font-bold mb-4">评论区</h2>

                 <div className="mb-4 border border-gray-200 rounded p-4 space-y-4 bg-[#f9f9f9] overflow-y-auto max-h-[500px] scroll-smooth">
                  {comments.length === 0 ? (
                  <p className="text-gray-500">暂无评论，快来发表第一个评论吧！</p>
                  ) : (
                      comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3 pb-4 border-b border-gray-300">
                  <img
                  src="https://via.placeholder.com/40"
                    alt="头像"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-gray-800">{comment.author}</span>
                      <span className="text-xs text-gray-500">{comment.created_at}</span>
                  </div>
                <p className="text-gray-700 mb-2 whitespace-pre-line">{comment.content}</p>

              {/* 二级操作按钮 */}
              <div className="flex items-center space-x-2 mt-1">
              <Button
                variant="light"
                size="sm"
                startContent={<ThumbsUp className="w-4 h-4" />}
                onPress={() => handleCommentLike(comment.id)}
              >
                赞同 {likesForComments[comment.id] || 0}
              </Button>
              <Button
                variant="light"
                size="sm"
                startContent={<MessageSquare className="w-4 h-4" />}
                onPress={() => {
                  setReplyingToId(comment.id);
                  setTimeout(() => replyInputRef.current?.focus(), 100);
                }}
              >
                回复
              </Button>
            </div>

            {/* 二级回复列表 */}
            {comment.replies.length > 0 && (
              <div className="mt-3 pl-6 space-y-2 border-l border-gray-200">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="text-sm text-gray-700">
                    <span className="font-semibold mr-2">{reply.author}:</span>
                    {reply.content}{" "}
                    <span className="text-xs text-gray-400 ml-2">{reply.created_at}</span>
                  </div>
                ))}
              </div>
            )}

            {/* 回复输入框（仅当前评论显示） */}
            {replyingToId === comment.id && (
              <div className="mt-2 flex gap-2">
                <Textarea
                ref={replyInputRef}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="写回复..."
                rows={2}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleAddReply(comment.id);
                  }
                }}
              />
              <Button
                color="primary"
                onPress={() => handleAddReply(comment.id)}
              >
                发送
              </Button>
              </div>
              )}
            </div>
          </div>
            )))}
           <div ref={commentEndRef} />
                  </div>

                  <div className="flex gap-2">
                    <Textarea
                      ref={commentInputRef}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="写评论..."
                      rows={2}
                      //回车直接发送
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault(); // 防止换行
                          addComment();
                        }
                      }}
                    />
                    <Button color="primary" onPress={addComment}>
                      发送
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}