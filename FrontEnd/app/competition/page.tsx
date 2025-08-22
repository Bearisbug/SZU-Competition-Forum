'use client';
import React, { useEffect, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Link } from "@heroui/react"

import { FilterSidebar, FilterOption} from "@/components/FilterSidebar"
import { API_BASE_URL } from "@/CONFIG";
import CompetitionCard, { Competition } from "@/components/Card/CompetitionCard"
import toast from 'react-hot-toast';
import { useAuthStore } from '@/components/AuthStore';

type FilterCategory = "competition_type" | "organizer"

export default function HomePage() {
  const router = useRouter();
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [filteredCompetitions, setFilteredCompetitions] = useState<Competition[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const competitionsPerPage = 6
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 从 AuthStore 获取登录状态
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filterCategories = [
    {
      title: "比赛类型",
      category: "competition_type" as FilterCategory,
      options: [
        { label: "黑客松", value: "Hackathon" },
        { label: "编程挑战", value: "Coding Challenge" },
        { label: "设计竞赛", value: "Design Competition" },
        { label: "数据科学", value: "Data Science" },
      ],
    },
    {
      title: "主办方",
      category: "organizer" as FilterCategory,
      options: [
        { label: "科技公司", value: "Tech Corp" },
        { label: "创新公司", value: "Innovation Inc" },
        { label: "编程大师", value: "Code Masters" },
        { label: "设计中心", value: "Design Hub" },
      ],
    },
  ]

  // 帖子点击处理函数
  const handlePostClick = (id: number, type?: string) => {
    router.push(`/competition/${id}`);
    console.log(`点击了帖子: ${id}`, type ? `类型: ${type}` : '');
  };

  // 分类点击处理
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setSelectedSubCategory(null);
  };

  // 子分类点击处理
  const handleSubCategoryClick = (subCategory: string) => {
    setSelectedSubCategory(subCategory);
  };

  // 卡片数据


const fetchCompetitions = useCallback(async () => {
  setIsLoading(true);
  try {
    const response = await fetch(`${API_BASE_URL}/api/competitions/`, {
        headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token") || ''}`,
      },
    });

    if (!response.ok) {
      throw new Error("无法加载竞赛信息！");
    }

    const data = await response.json();
    setCompetitions(data);
    setFilteredCompetitions(data);
  } catch (error) {
    console.error("获取竞赛信息错误:", error);
    toast.error("加载竞赛信息失败，请稍后重试！");
  } finally {
    setIsLoading(false);
  }
}, []);

useEffect(() => {
  fetchCompetitions();
}, [fetchCompetitions]);


  // 筛选卡片
  const filteredCards = competitions.filter(card => {
  if (selectedCategory && selectedSubCategory) {
    return card.competition_level === selectedCategory && card.competition_subtype === selectedSubCategory;
  }
  if (selectedCategory) {
    return card.competition_level === selectedCategory;
  }
  if (selectedSubCategory) {
    return card.competition_subtype === selectedSubCategory;
  }
  return true;
});


  // 重置筛选
  const resetFilters = () => {
    setSelectedCategory(null);
    setSelectedSubCategory(null);
  };

  const handleFilterChange = (filters: FilterOption[]) => {
    const newFilteredCompetitions = competitions.filter((competition) =>
      filters.every(
        (filter) =>
          competition[filter.category as keyof Competition] === filter.value
      )
    )
    setFilteredCompetitions(newFilteredCompetitions)
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ paddingTop: mounted ? (isLoggedIn ? "114px" : "60px") : "60px" }}>
      <div className="max-w-7xl mx-auto p-4">
        {/* 顶部标题栏 */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">比赛列表</h1>
          <Link href="/competition/create">
            <Button color="primary" size="lg">创建比赛</Button>
          </Link>
        </div>

        {/* 主要内容区 */}
        <div className="flex gap-6">
          {/* 左侧固定分类导航 */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-gradient-to-b from-blue-800 to-blue-900 text-white rounded-2xl shadow-xl p-6 sticky top-20">
              <div className="flex justify-between items-center mb-6 pb-3 border-b-2 border-white/30">
                <h2 className="text-xl font-bold">竞赛分类</h2>
                {(selectedCategory || selectedSubCategory) && (
                  <button 
                    onClick={resetFilters}
                    className="text-sm bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg transition-colors duration-200"
                  >
                    重置筛选
                  </button>
                )}
              </div>
              
{/* I类竞赛 */}
<div className="mb-6">
  <h3
    className={`text-lg font-bold mb-3 flex items-center cursor-pointer ${
      selectedCategory === 'Ⅰ类' ? 'text-pink-600' : 'text-blue-200'
    }`}
    onClick={() => handleCategoryClick('Ⅰ类')}
  >
    <div className="w-3 h-3 rounded-full bg-blue-300 mr-2"></div>
    I 类竞赛
  </h3>
  
  {/* 只有选中时才显示子分类 */}
  {selectedCategory === 'Ⅰ类' && (
    <ul className="space-y-2 ml-5">
      <li>
        <button
          className={`w-full text-left py-2 px-3 rounded-lg transition-all duration-200 text-sm ${
            selectedSubCategory === '中国互联网+大学生创新创业大赛'
              ? 'bg-pink-600 text-white shadow-md' 
              : 'bg-blue-700/40 hover:bg-pink-600/80 hover:text-white'
          }`}
          onClick={() => handleSubCategoryClick('中国互联网+大学生创新创业大赛')}
        >
          中国"互联网+"大学生创新创业大赛
        </button>
      </li>
      <li>
        <button
          className={`w-full text-left py-2 px-3 rounded-lg transition-all duration-200 text-sm ${
            selectedSubCategory === '挑战杯课外学术科技作品竞赛'
              ? 'bg-pink-600 text-white shadow-md' 
              : 'bg-blue-700/40 hover:bg-pink-600/80 hover:text-white'
          }`}
          onClick={() => handleSubCategoryClick('挑战杯课外学术科技作品竞赛')}
        >
          "挑战杯"课外学术科技作品竞赛
        </button>
      </li>
      <li>
        <button
          className={`w-full text-left py-2 px-3 rounded-lg transition-all duration-200 text-sm ${
            selectedSubCategory === '挑战杯大学生创业计划竞赛'
              ? 'bg-pink-600 text-white shadow-md' 
              : 'bg-blue-700/40 hover:bg-pink-600/80 hover:text-white'
          }`}
          onClick={() => handleSubCategoryClick('挑战杯大学生创业计划竞赛')}
        >
          "挑战杯"大学生创业计划竞赛
        </button>
      </li>
    </ul>
  )}
</div>

{/* II类竞赛 */}
<div className="mb-6">
  <h3
    className={`text-lg font-bold mb-3 flex items-center cursor-pointer ${
      selectedCategory === 'Ⅱ类' ? 'text-pink-600' : 'text-blue-200'
    }`}
    onClick={() => handleCategoryClick('Ⅱ类')}
  >
    <div className="w-3 h-3 rounded-full bg-blue-400 mr-2"></div>
    II 类竞赛
  </h3>
  
  {selectedCategory === 'Ⅱ类' && (
    <ul className="space-y-2 ml-5">
      <li>
        <button
          className={`w-full text-left py-2 px-3 rounded-lg transition-all duration-200 text-sm ${
            selectedSubCategory === 'A类'
              ? 'bg-pink-600 text-white shadow-md' 
              : 'bg-blue-700/40 hover:bg-pink-600/80 hover:text-white'
          }`}
          onClick={() => handleSubCategoryClick('A类')}
        >
          (A) 类
        </button>
      </li>
      <li>
        <button
          className={`w-full text-left py-2 px-3 rounded-lg transition-all duration-200 text-sm ${
            selectedSubCategory === 'B类'
              ? 'bg-pink-600 text-white shadow-md' 
              : 'bg-blue-700/40 hover:bg-pink-600/80 hover:text-white'
          }`}
          onClick={() => handleSubCategoryClick('B类')}
        >
          (B) 类
        </button>
      </li>
      <li>
        <button
          className={`w-full text-left py-2 px-3 rounded-lg transition-all duration-200 text-sm ${
            selectedSubCategory === 'C类'
              ? 'bg-pink-600 text-white shadow-md' 
              : 'bg-blue-700/40 hover:bg-pink-600/80 hover:text-white'
          }`}
          onClick={() => handleSubCategoryClick('C类')}
        >
          (C) 类
        </button>
      </li>
    </ul>
  )}
</div>

{/* III类竞赛 */}
<div className="mb-4">
  <h3
    className={`text-lg font-bold mb-3 flex items-center cursor-pointer ${
      selectedCategory === 'Ⅲ类' ? 'text-pink-600' : 'text-blue-200'
    }`}
    onClick={() => handleCategoryClick('Ⅲ类')}
  >
    <div className="w-3 h-3 rounded-full bg-blue-400 mr-2"></div>
    III 类竞赛
  </h3>

  {selectedCategory === 'Ⅲ类' && (
    <div className="ml-5 text-center py-3 text-blue-200 text-sm bg-blue-700/20 rounded-lg">
      <p>更多竞赛即将上线</p>
    </div>
  )}
</div>

            </div>
          </div>

          {/* 右侧内容区 */}
          <div className="flex-1 min-w-0">
            {/* 筛选状态显示 */}
            {(selectedCategory || selectedSubCategory) && (
              <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm">当前筛选: </span>
                  <span className="font-semibold ml-2 px-2 py-1 bg-blue-100 rounded text-sm">
                    {selectedSubCategory ? `${selectedCategory} - ${selectedSubCategory}` : selectedCategory}
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
              {filteredCards.map(card => (
                <div 
                  key={card.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group"
                  onClick={() => handlePostClick(card.id, card.competition_type)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                    <div 
                      className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url('${card.cover_image}')` }}
                    ></div>
                    <div className="absolute bottom-4 left-4 z-20">
                      <span className={`text-white text-xs px-3 py-1 rounded-full font-medium ${
                        card.competition_level.includes('I类') ? 'bg-blue-600' : 
                        card.competition_level.includes('II类') ? 'bg-green-600' : 
                        'bg-purple-600'
                      }`}>
                        {card.competition_level}
                        {card.competition_level && ` - ${card.competition_subtype}`}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h4 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {card.name}
                    </h4>
                    <div
                      className="text-sm text-gray-600 mb-3 line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: card.details }}
                    ></div>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{new Date(card.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                ))}
            </div>
            
            {/* 无匹配结果的提示 */}
            {filteredCards.length === 0 && (
              <div className="text-center py-16">
                <div className="text-2xl text-gray-400 mb-4">🔍</div>
                <div className="text-xl text-gray-500 mb-4">没有找到匹配的竞赛</div>
                <p className="text-gray-400 mb-6">尝试调整筛选条件或查看所有竞赛</p>
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