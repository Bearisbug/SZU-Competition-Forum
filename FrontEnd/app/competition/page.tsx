'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Link } from "@heroui/react"

import { FilterSidebar, FilterOption} from "@/components/FilterSidebar"
import { API_BASE_URL } from "@/CONFIG";
import CompetitionCard, { Competition } from "@/components/Card/CompetitionCard"

type FilterCategory = "competition_type" | "organizer"

export default function HomePage() {
  const router = useRouter();
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [filteredCompetitions, setFilteredCompetitions] = useState<Competition[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const competitionsPerPage = 6
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);

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
  const handlePostClick = (id: string, type?: string) => {
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
  const cardData = [
    {
      id: '1',
      type: 'I类-"互联网+"',
      title: '中国"互联网+"大学生创新创业大赛全国总决赛',
      description: '全国最具影响力的创新创业赛事，激发大学生创新潜能',
      image: '/images/a.jpg',
      date: '2024-09-15',
      reads: '2.4k',
      category: 'I类-"互联网+"'
    },
    {
      id: '2',
      type: 'I类-"挑战杯"课外学术科技作品竞赛',
      title: '"挑战杯"全国大学生课外学术科技作品竞赛',
      description: '展示大学生科技创新成果的重要平台',
      image: '/images/tzbkw.png',
      date: '2025-3-27',
      reads: '1.8k',
      category: 'I类-"挑战杯"课外学术科技作品竞赛'
    },
    {
      id: '3',
      type: 'I类-"挑战杯"大学生创业计划竞赛',
      title: '"挑战杯"中国大学生创业计划竞赛',
      description: '培养大学生创业意识和创业能力的重要赛事',
      image: '/images/tzbcy.png',
      date: '2024-11-05',
      reads: '1.6k',
      category: 'I类-"挑战杯"大学生创业计划竞赛'
    },
    {
      id: '4',
      type: 'III类',
      title: '蓝桥杯全国软件和信息技术专业人才大赛',
      description: '全国性IT类学科竞赛，培养专业人才的重要平台',
      image: '/images/lqb.png',
      date: '2024-12-10',
      reads: '3.1k',
      category: 'III类',
    },
    {
      id: '5',
      type: 'II类',
      title: '全国大学生数学建模竞赛',
      description: '培养创新意识和团队精神的重要科技竞赛',
      image: '/images/sj.png',
      date: '2024-08-20',
      reads: '2.1k',
      category: 'II类',
      subCategory: 'A类'
    },
    {
      id: '6',
      type: 'II类',
      title: '全国大学生电子设计竞赛',
      description: '电子信息技术领域的重要学科竞赛',
      image: '/images/dzsj.png',
      date: '2024-07-15',
      reads: '1.9k',
      category: 'II类',
      subCategory: 'B类'
    }
  ];

  // 筛选卡片
  const filteredCards = cardData.filter(card => {
    if (selectedSubCategory) {
      return card.subCategory === selectedSubCategory;
    }
    if (selectedCategory) {
      return card.category === selectedCategory;
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
    <div className="min-h-screen bg-gray-50 pt-16">
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
                <h3 className="text-lg font-bold mb-3 flex items-center text-blue-200">
                  <div className="w-3 h-3 rounded-full bg-blue-300 mr-2"></div>
                  I 类竞赛
                </h3>
                <ul className="space-y-2 ml-5">
                  <li>
                    <button
                      className={`w-full text-left py-2 px-3 rounded-lg transition-all duration-200 text-sm ${
                        selectedCategory === 'I类-"互联网+"'
                          ? 'bg-pink-600 text-white shadow-md' 
                          : 'bg-blue-700/40 hover:bg-pink-600/80 hover:text-white'
                      }`}
                      onClick={() => handleCategoryClick('I类-"互联网+"')}
                    >
                      中国"互联网+"大学生创新创业大赛
                    </button>
                  </li>
                  <li>
                    <button
                      className={`w-full text-left py-2 px-3 rounded-lg transition-all duration-200 text-sm ${
                        selectedCategory === 'I类-"挑战杯"课外学术科技作品竞赛'
                          ? 'bg-pink-600 text-white shadow-md' 
                          : 'bg-blue-700/40 hover:bg-pink-600/80 hover:text-white'
                      }`}
                      onClick={() => handleCategoryClick('I类-"挑战杯"课外学术科技作品竞赛')}
                    >
                      "挑战杯"课外学术科技作品竞赛
                    </button>
                  </li>
                  <li>
                    <button
                      className={`w-full text-left py-2 px-3 rounded-lg transition-all duration-200 text-sm ${
                        selectedCategory === 'I类-"挑战杯"大学生创业计划竞赛'
                          ? 'bg-pink-600 text-white shadow-md' 
                          : 'bg-blue-700/40 hover:bg-pink-600/80 hover:text-white'
                      }`}
                      onClick={() => handleCategoryClick('I类-"挑战杯"大学生创业计划竞赛')}
                    >
                      "挑战杯"大学生创业计划竞赛
                    </button>
                  </li>
                </ul>
              </div>

              {/* II类竞赛 */}
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-3 flex items-center text-blue-200">
                  <div className="w-3 h-3 rounded-full bg-blue-400 mr-2"></div>
                  II 类竞赛
                </h3>
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
              </div>

              {/* III类竞赛 */}
              <div className="mb-4">
                <h3 className="text-lg font-bold mb-3 flex items-center text-blue-200">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  III 类竞赛
                </h3>
                <div className="ml-5 text-center py-3 text-blue-200 text-sm bg-blue-700/20 rounded-lg">
                  <p>更多竞赛即将上线</p>
                </div>
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
                    {selectedSubCategory ? `II类 - ${selectedSubCategory}` : selectedCategory}
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
                  onClick={() => handlePostClick(card.id, card.type)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                    <div 
                      className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url('${card.image}')` }}
                    ></div>
                    <div className="absolute bottom-4 left-4 z-20">
                      <span className={`text-white text-xs px-3 py-1 rounded-full font-medium ${
                        card.type.includes('I类') ? 'bg-blue-600' : 
                        card.type.includes('II类') ? 'bg-green-600' : 
                        'bg-purple-600'
                      }`}>
                        {card.type}
                        {card.subCategory && ` - ${card.subCategory}`}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h4 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {card.title}
                    </h4>
                    <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                      {card.description}
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{card.date}</span>
                      <span>阅读 {card.reads}</span>
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