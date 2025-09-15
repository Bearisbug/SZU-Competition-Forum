"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Link, Input } from "@heroui/react";
import AppPagination from "@/components/Pagination";
import CompetitionCard from "@/components/Card/CompetitionCard";
import toast from "react-hot-toast";
import { withAuth } from "@/lib/auth-guards";
import {
  Competition,
  COMPETITION_FILTER_CATEGORIES,
  CompetitionFilterCategoryKey,
} from "@/modules/competition/competition.model";
import {fetchMyRole} from "@/modules/global/global.api";
import {deleteCompetition, fetchCompetitions} from "@/modules/competition/competition.api";
import LoadingPage from "@/components/LoadingPage";
import {FilterNode} from "@/modules/global/global.model";

function CompetitionPageContent() {
  const router = useRouter();
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [currentFilterNodeRecord, setCurrentFilterNodeRecord] =
    useState<Record<CompetitionFilterCategoryKey, FilterNode[]>>({} as Record<CompetitionFilterCategoryKey, FilterNode[]>);
  const [currentPage, setCurrentPage] = useState(1);
  const competitionsPerPage = 6;
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  //const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [role, setRole] = useState<string | null>(null);
  const isAdmin = (role || "").toLowerCase() === "admin";
  const [searchQuery, setSearchQuery] = useState("");

  // 帖子点击处理函数
  const handlePostClick = (id: number) => {
    router.push(`/competition/${id}`);
    console.log(`点击了帖子: ${id}`);
  };

  const handleFilterNodeClick =
    (categoryKey: CompetitionFilterCategoryKey, depth: number, node: FilterNode) => {
    setCurrentFilterNodeRecord(prev => {
      const categoryNodes = prev[categoryKey] ?? [];

      let newNodes: FilterNode[];

      if (depth < categoryNodes.length) {
        newNodes = categoryNodes.slice(0, depth + 1);
        newNodes[newNodes.length - 1] = node;
      }
      else if (depth === categoryNodes.length) {
        newNodes = [...categoryNodes, node];
      }
      else {
        throw new Error("发生未知错误：查询深度与目录长度不匹配");
      }

      console.log(newNodes);

      return {
        ...prev,
        [categoryKey]: newNodes,
      };
    });
  };

  // 筛选卡片（按分类 + 关键字）
  const filteredCards = ((): Competition[] => {
    let filterResult = competitions;

    Object.entries(currentFilterNodeRecord).forEach(([categoryKey, nodes]) => {
      switch (categoryKey) {
        case "competition_level":
          for (let i = 0; i < nodes.length; i++) {
            switch (i) {
              case 0:
                filterResult = filterResult.filter((competition) => {
                  return competition.competition_level === nodes[i].value;
                })
                break;
              case 1:
                filterResult = filterResult.filter((competition) => {
                  return competition.competition_subtype === nodes[i].value;
                })
                break;
            }
          }
          break;
      }
    });

    filterResult = filterResult.filter((card) =>
      (searchQuery.trim() === "")
        ? true
        : String(card.name || "").toLowerCase().includes(searchQuery.toLowerCase().trim())
    );

    return filterResult;
  })();

  const getFilterNodeChainString = (nodes: FilterNode[]): string => {
    return nodes.map((node) => node.value).join("-");
  }

  // 分页计算
  const totalPages = Math.ceil(filteredCards.length / competitionsPerPage);
  const indexOfLast = currentPage * competitionsPerPage;
  const indexOfFirst = indexOfLast - competitionsPerPage;
  const currentCompetitions = filteredCards.slice(indexOfFirst, indexOfLast);

  // 重置筛选
  const resetFilters = () => {
    setCurrentFilterNodeRecord({} as Record<CompetitionFilterCategoryKey, FilterNode[]>);
  };

  const handleDeleteCompetition = async (id: number) => {
    if (!isAdmin) return;
    const token = localStorage.getItem("access_token") || "";
    const ok = window.confirm("确认删除该比赛吗？此操作不可撤销。");
    if (!ok) return;

    const result = await deleteCompetition(id, token);
    if (result.ok) {
      // 本地移除
      setCompetitions((prev) => prev.filter((c) => c.id !== id));
      toast.success("比赛已删除");
    }
    else {
      toast.error("删除比赛失败！");
      console.log(result.value);
    }
  }

  useEffect(() => {
    const loadResources = async () => {
      await Promise.all([
        (async () => {
          const result = await fetchCompetitions();

          if (result.ok) {
            setCompetitions(result.value);
          }
          else {
            toast.error("加载竞赛信息失败，请稍后重试！");
            console.log(result.value);
            setLoadFailed(true);
          }
        })(),
        (async () => {
          const result = await fetchMyRole();

          if (result.ok) {
            setRole(result.value);
          }
          else {
            toast.error("加载用户角色信息失败！");
            console.log(result.value);
            setLoadFailed(true);
          }
        })()
      ]);

      setLoading(false);
    }

    void loadResources();
  }, []);

  if (loading) {
    return (
      <LoadingPage />
    )
  }

  if (loadFailed) {
    return (
      <LoadingPage />
    )
  }

  return (
    <div
      className="flex-1 min-h-0 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto p-4">
        {/* 顶部标题栏 */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">比赛列表</h1>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Input
              placeholder="搜索比赛名称..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="md:w-80"
            />
            {isAdmin && (
              <Link href="/competition/create">
                <Button color="primary" size="lg">
                  创建比赛
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* 主要内容区 */}
        <div className="flex gap-6">
          {/* 左侧固定分类导航 */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-gradient-to-b from-blue-800 to-blue-900 text-white rounded-2xl shadow-xl p-6 sticky top-20">
              {
                COMPETITION_FILTER_CATEGORIES.map((category, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-6 pb-3 border-b-2 border-white/30">
                      <h2 className="text-xl font-bold">{category.title}</h2>
                      {(Object.keys(currentFilterNodeRecord).length > 0) && (index == 0) && (
                        <button
                          onClick={resetFilters}
                          className="text-sm bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg transition-colors duration-200"
                        >
                          重置筛选
                        </button>
                      )}
                    </div>
                    {
                      category.options.map((node0) => {
                        return (
                          <div key={node0.value} className="mb-6">
                            <h3
                              className={`text-lg font-bold mb-3 flex items-center cursor-pointer ${
                                ((category.key in currentFilterNodeRecord)
                                  && (currentFilterNodeRecord[category.key][0] == node0)
                                  ? "text-pink-600"
                                  : "text-blue-200")
                              }`}
                              onClick={() => handleFilterNodeClick(category.key, 0, node0)}
                            >
                              <div className="w-3 h-3 rounded-full bg-blue-300 mr-2"></div>
                              {node0.value}
                            </h3>

                            {/* 只有选中时才显示子分类 */}
                            {(category.key in currentFilterNodeRecord)
                              && (currentFilterNodeRecord[category.key].length > 0)
                              && (currentFilterNodeRecord[category.key][0] == node0)
                              && (
                              <ul className="space-y-2 ml-5">
                                {(() => {
                                  const children = node0.children;

                                  return children ? children.map((node1) => (
                                    <li key={node1.value}>
                                      <button
                                        className={`w-full text-left py-2 px-3 rounded-lg transition-all duration-200 text-sm ${
                                          ((category.key in currentFilterNodeRecord)
                                          && (currentFilterNodeRecord[category.key][1] == node1)
                                            ? "bg-pink-600 text-white shadow-md"
                                            : "bg-blue-700/40 hover:bg-pink-600/80 hover:text-white")
                                        }`}
                                        onClick={() =>
                                          handleFilterNodeClick(category.key, 1, node1)
                                        }
                                      >
                                        {node1.value}
                                      </button>
                                    </li>
                                  )) :
                                    (
                                      <div className="text-center py-3 text-blue-200 text-sm bg-blue-700/20 rounded-lg">
                                        <p>更多竞赛即将上线</p>
                                      </div>
                                    )
                                })()}
                              </ul>
                            )}
                          </div>
                        )
                      })
                    }
                  </div>
                ))
              }

            </div>
          </div>

          {/* 右侧内容区 */}
          <div className="flex-1 min-w-0">
            {/* 筛选状态显示 */}
            {(Object.keys(currentFilterNodeRecord).length > 0) && (
              <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm">当前筛选: </span>
                  <span className="font-semibold ml-2 px-2 py-1 bg-blue-100 rounded text-sm">
                    {
                      Object.values(currentFilterNodeRecord)
                        .map((nodes) => getFilterNodeChainString(nodes))
                        .join("  ")
                    }
                  </span>
                </div>
                <button
                  onClick={resetFilters}
                  className="text-sm bg-blue-200 hover:bg-blue-300 px-3 py-1 rounded-lg transition-colors duration-200"
                >
                  清除筛选
                </button>
              </div>
            )}

            {/* 竞赛卡片网格 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {currentCompetitions.map((card) => (
                <CompetitionCard
                  key={card.id}
                  competition={card}
                  isAdmin={isAdmin}
                  onClick={(id) => handlePostClick(id)}
                  onDelete={handleDeleteCompetition}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-6 flex justify-center">
                <AppPagination
                  total={totalPages}
                  page={currentPage}
                  onChangeAction={(p) => {
                    setCurrentPage(p);
                    if (typeof window !== "undefined") {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                />
              </div>
            )}

            {filteredCards.length === 0 && (
              <div className="text-center py-16">
                <div className="text-2xl text-gray-400 mb-4">🔍</div>
                <div className="text-xl text-gray-500 mb-4">
                  没有找到匹配的竞赛
                </div>
                <p className="text-gray-400 mb-6">
                  尝试调整筛选条件或查看所有竞赛
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                >
                  查看所有竞赛
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 使用登录校验高阶组件包装原始组件
const CompetitionPage = withAuth(CompetitionPageContent);
export default CompetitionPage;
