"use client";

import React, { useState } from "react";
import { Input } from "@heroui/react";
import { Search } from "lucide-react";

export default function OnlineLectureIntro() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const categories = [
    {
      id: "programming",
      name: "程序设计基础",
      englishName: "Fundamentals of Programming"
    },
    {
      id: "algorithms",
      name: "算法基础",
      englishName: "Fundamentals of Algorithms"
    },
    {
      id: "database",
      name: "数据库基础",
      englishName: "Fundamentals of Databases"
    },
    {
      id: "web",
      name: "Web开发",
      englishName: "Web Development"
    },
    {
      id: "ai",
      name: "人工智能",
      englishName: "Artificial Intelligence"
    }
  ];

  const carouselSlides = [
    {
      title: "从ACM惨败到区域赛银牌：我的三个月自救计划",
      desc: "我失败后重整旗鼓，终于逆袭成功……",
      author: "张明明",
      video: "video1.mp4",
      category: "algorithms"
    },
    {
      title: "黑客马拉松48小时：我们如何用ChatGPT忽悠评委？",
      desc: "AI编故事，我们编代码，谁说不行？",
      author: "李强",
      video: "video2.mp4",
      category: "ai"
    },
    {
      title: "开发大赛获奖后，我才看懂Git提交记录里的成长",
      desc: "那些看似微小的commit，其实是努力的印记。",
      author: "Tony",
      video: "video3.mp4",
      category: "programming"
    },
    {
      title: "用TypeScript写算法是一种怎样的体验？",
      desc: "静态类型的魅力远超预期，效率暴增！",
      author: "林夕",
      video: "video4.mp4",
      category: "algorithms"
    },
    {
      title: "你真的了解CSS Flex布局吗？",
      desc: "5分钟带你入门、10分钟掌握核心技巧。",
      author: "小王",
      video: "video5.mp4",
      category: "web"
    }
  ];

  // 筛选逻辑
  const filteredSlides = carouselSlides.filter((slide) => {
    const matchesSearch = 
      slide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      slide.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      slide.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory ? slide.category === selectedCategory : true;
    
    return matchesSearch && matchesCategory;
  });

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
  };

  const resetFilters = () => {
    setSelectedCategory(null);
    setSearchTerm("");
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/bg3.png')" }}
    >
      {/* 半透明背景遮罩 */}
      <div className="absolute inset-0 bg-white/80 z-0" />

      {/* 内容容器 */}
      <div className="relative z-10 min-h-screen">
        <div className="container mx-auto p-4 lg:p-8">
          {/* 顶部标题和搜索 */}
          <div className="flex flex-col lg:flex-row justify-between items-center mb-8 pt-16">
            <div className="text-center lg:text-left mb-4 lg:mb-0">
              <h1 className="text-3xl font-bold mb-4 text-[#024d8f] inline-block pb-2 border-b-4 border-[#024d8f]">
                在线讲座
              </h1>
              <div className="text-[#024d8f] space-y-1 mt-4 text-sm lg:text-base">
                <p>邀请经验丰富的导师入驻平台</p>
                <p>定期发布指导文章和直播课程</p>
                <p>为学生提供专业知识和竞赛技巧的传授</p>
              </div>
            </div>
            
            {/* 搜索框 */}
            <div className="flex items-center gap-2 bg-[#024d8f] rounded-full px-4 py-2 shadow-md w-full max-w-xs">
              <input
                type="text"
                placeholder="输入关键词搜索"
                className="bg-transparent border-0 text-white placeholder-white focus:outline-none text-sm flex-1"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="text-white w-5 h-5" />
            </div>
          </div>

          {/* 主要内容区 */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* 左侧分类栏 - 响应式设计 */}
            <div className="w-full lg:w-80 lg:flex-shrink-0">
              <div className="bg-[#024d8f] text-white rounded-lg shadow-lg p-4 lg:p-6 lg:sticky lg:top-4">
                <div className="flex justify-between items-center mb-4 pb-3 border-b-2 border-white/30">
                  <h2 className="text-lg lg:text-xl font-bold">
                    课程分类
                    <br />
                    <span className="text-xs lg:text-sm font-normal opacity-80">CATEGORY</span>
                  </h2>
                  {selectedCategory && (
                    <button
                      onClick={resetFilters}
                      className="text-xs bg-red-500 hover:bg-red-600 px-2 py-1 rounded transition-colors duration-200"
                    >
                      重置
                    </button>
                  )}
                </div>
                
                <ul className="space-y-3">
                  {categories.map((category) => (
                    <li key={category.id}>
                      <button
                        onClick={() => handleCategoryClick(category.id)}
                        className={`w-full text-left p-3 rounded-lg transition-all duration-300 ${
                          selectedCategory === category.id
                            ? 'bg-red-600 text-white shadow-md'
                            : 'hover:bg-red-900/80 hover:shadow-sm'
                        }`}
                      >
                        <div className="font-medium text-sm lg:text-base">
                          - {category.name}
                        </div>
                        <div className="text-xs opacity-80 mt-1">
                          {category.englishName}
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
                
                {/* 统计信息 */}
                <div className="mt-6 pt-4 border-t border-white/30">
                  <div className="text-sm text-center">
                    <div className="mb-2">
                      显示课程: <span className="font-bold text-yellow-300">{filteredSlides.length}</span> / {carouselSlides.length}
                    </div>
                    {selectedCategory && (
                      <div className="text-xs opacity-80">
                        当前分类: {categories.find(c => c.id === selectedCategory)?.name}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 右侧课程内容 */}
            <div className="flex-1 min-w-0">
              {/* 筛选状态提示 */}
              {(selectedCategory || searchTerm) && (
                <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm">当前筛选:</span>
                    {selectedCategory && (
                      <span className="bg-blue-100 px-2 py-1 rounded text-xs font-medium">
                        {categories.find(c => c.id === selectedCategory)?.name}
                      </span>
                    )}
                    {searchTerm && (
                      <span className="bg-green-100 px-2 py-1 rounded text-xs font-medium text-green-800">
                        "{searchTerm}"
                      </span>
                    )}
                  </div>
                  <button
                    onClick={resetFilters}
                    className="text-sm bg-blue-200 hover:bg-blue-300 px-3 py-1 rounded transition-colors duration-200"
                  >
                    清除所有筛选
                  </button>
                </div>
              )}

              {/* 课程网格 */}
              <div className="bg-white bg-opacity-95 rounded-lg shadow-lg p-4 lg:p-8">
                {filteredSlides.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredSlides.map((slide, index) => (
                      <div
                        key={index}
                        className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                      >
                        <video
                          src={slide.video}
                          controls
                          className="w-full h-48 object-cover"
                          poster="/default-video-poster.jpg" // 可以添加默认封面
                        />
                        <div className="p-4 flex flex-col flex-grow">
                          <h3 className="text-lg font-bold text-[#024d8f] mb-2 line-clamp-2">
                            {slide.title}
                          </h3>
                          <hr className="border-gray-200 mb-3" />
                          <p className="text-sm text-gray-700 flex-grow mb-3 line-clamp-3">
                            {slide.desc}
                          </p>
                          <div className="flex justify-between items-center text-sm text-gray-500">
                            <span>作者：{slide.author}</span>
                            <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                              {categories.find(c => c.id === slide.category)?.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="text-4xl mb-4">🔍</div>
                    <h3 className="text-xl text-gray-500 mb-2">没有找到相关课程</h3>
                    <p className="text-gray-400 mb-6">
                      尝试调整搜索关键词或选择其他分类
                    </p>
                    <button
                      onClick={resetFilters}
                      className="px-6 py-3 bg-[#024d8f] text-white rounded-lg hover:bg-[#024d8f]/90 transition-colors duration-200"
                    >
                      查看所有课程
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}