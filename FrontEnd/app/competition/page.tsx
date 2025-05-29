'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);

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

  return (

    <div className="container mx-auto p-4 flex mt-16">
      <FilterSidebar
        onFilterChange={handleFilterChange}
        //@ts-ignore
        filterCategories={filterCategories}
      />

      <div className="flex-1 ml-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">比赛列表</h1>
          <Link href="/competition/create">
          <Button color="primary">创建比赛</Button>
          </Link>
        </div>
      </div>

      {/* 主要内容区 */}
      <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto relative z-10">
        {/* 左侧分类导航 */}
        <div className="bg-gradient-to-b from-blue-800 to-blue-900 text-white rounded-2xl shadow-xl p-6 w-full lg:w-1/4">
          <div className="flex justify-between items-center mb-6 pb-2 border-b-2 border-white/30">
            <h2 className="text-2xl font-bold">竞赛分类</h2>
            {selectedCategory && (
              <button 
                onClick={resetFilters}
                className="text-sm bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded transition-colors"
              >
                重置筛选
              </button>
            )}
          </div>
          
          <div className="mb-8">
            <h3 
              className={`text-xl font-bold mb-4 flex items-center cursor-pointer transition-colors ${
                selectedCategory === 'I类' ? 'text-blue-300' : ''
              }`}
              onClick={() => handleCategoryClick('I类')}
            >
              <div className={`w-3 h-3 rounded-full mr-2 ${
                selectedCategory === 'I类' ? 'bg-blue-300' : 'bg-blue-300'
              }`}></div>
              I 类竞赛
            </h3>
            <ul className="space-y-3">
              <li 
                className={`py-2 px-4 rounded-lg transition-colors cursor-pointer ${
                  selectedCategory === 'I类' 
                    ? 'bg-pink-900' 
                    : 'bg-blue-700/50 hover:bg-pink-900'
                }`}
                onClick={() => handleCategoryClick('I类-"互联网+"')}
              >
                中国"互联网+"大学生创新创业大赛全国总决赛
              </li>
              <li 
                className={`py-2 px-4 rounded-lg transition-colors cursor-pointer ${
                  selectedCategory === 'I类' 
                    ? 'bg-pink-900' 
                    : 'bg-blue-700/50 hover:bg-pink-900'
                }`}
                onClick={() => handleCategoryClick('I类-"挑战杯"课外学术科技作品竞赛')}
              >
                "挑战杯"全国大学生课外学术科技作品竞赛
              </li>
              <li 
                className={`py-2 px-4 rounded-lg transition-colors cursor-pointer ${
                  selectedCategory === 'I类' 
                    ? 'bg-pink-900' 
                    : 'bg-blue-700/50 hover:bg-pink-900'
                }`}
                onClick={() => handleCategoryClick('I类-"挑战杯"大学生创业计划竞赛')}
              >
                "挑战杯"中国大学生创业计划竞赛
              </li>
            </ul>
          </div>

          <div className="mb-8">
            <h3 
              className={`text-xl font-bold mb-4 flex items-center cursor-pointer transition-colors ${
                selectedCategory === 'II类' ? 'text-blue-400' : ''
              }`}
              onClick={() => handleCategoryClick('II类')}
            >
              <div className={`w-3 h-3 rounded-full mr-2 ${
                selectedCategory === 'II类' ? 'bg-blue-400' : 'bg-blue-400'
              }`}></div>
              II 类竞赛
            </h3>
            <ul className="space-y-3">
              <li 
                className={`py-2 px-4 rounded-lg transition-colors cursor-pointer ${
                  selectedSubCategory === 'A类' 
                    ? 'bg-pink-900' 
                    : 'bg-blue-700/50 hover:bg-pink-900'
                }`}
                onClick={() => handleSubCategoryClick('A类')}
              >
                (A) 类
              </li>
              <li 
                className={`py-2 px-4 rounded-lg transition-colors cursor-pointer ${
                  selectedSubCategory === 'B类' 
                    ? 'bg-pink-900' 
                    : 'bg-blue-700/50 hover:bg-pink-900'
                }`}
                onClick={() => handleSubCategoryClick('B类')}
              >
                (B) 类
              </li>
              <li 
                className={`py-2 px-4 rounded-lg transition-colors cursor-pointer ${
                  selectedSubCategory === 'C类' 
                    ? 'bg-pink-900' 
                    : 'bg-blue-700/50 hover:bg-pink-900'
                }`}
                onClick={() => handleSubCategoryClick('C类')}
              >
                (C) 类
              </li>
            </ul>
          </div>

          <div>
            <h3 
              className={`text-xl font-bold mb-4 flex items-center cursor-pointer transition-colors ${
                selectedCategory === 'III类' ? 'text-blue-500' : ''
              }`}
              onClick={() => handleCategoryClick('III类')}
            >
              <div className={`w-3 h-3 rounded-full mr-2 ${
                selectedCategory === 'III类' ? 'bg-blue-500' : 'bg-blue-500'
              }`}></div>
              III 类竞赛
            </h3>
            <div className="text-center py-4 text-blue-200">
              <p>更多竞赛即将上线</p>
            </div>
          </div>
        </div>

        {/* 右侧帖子列表 */}
        <div className="flex-1">
          {/* 筛选状态显示 */}
          {selectedCategory && (
            <div className="mb-6 bg-blue-100 text-blue-800 px-4 py-3 rounded-lg flex items-center">
              <span>当前筛选: </span>
              <span className="font-bold ml-2">
                {selectedSubCategory ? `${selectedCategory} - ${selectedSubCategory}` : selectedCategory}
              </span>
              <button 
                onClick={resetFilters}
                className="ml-auto text-sm bg-blue-200 hover:bg-blue-300 px-3 py-1 rounded transition-colors"
              >
                清除筛选
              </button>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <span className={`${
                      card.type === 'I类' ? 'bg-blue-600' : 
                      card.type === 'II类' ? 'bg-green-600' : 
                      'bg-purple-600'
                    } text-white text-sm px-3 py-1 rounded-full`}>
                      {card.type}
                      {card.subCategory && ` - ${card.subCategory}`}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h4 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                    {card.title}
                  </h4>
                  <p className="text-gray-600 mb-4">
                    {card.description}
                  </p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{card.date}</span>
                    <span>阅读 {card.reads}</span>
                  </div>
                </div>
              </div>
            ))}
            
            {/* 无匹配结果的提示 */}
            {filteredCards.length === 0 && (
              <div className="col-span-2 text-center py-12">
                <div className="text-2xl text-gray-500 mb-4">没有找到匹配的竞赛</div>
                <button 
                  onClick={resetFilters}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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