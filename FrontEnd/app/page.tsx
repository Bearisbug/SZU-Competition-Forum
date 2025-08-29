'use client';
import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/auth-guards';

export default function HomePage() {
  const [currentSection, setCurrentSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const totalSections = 4;

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      if (isScrolling) return;
      
      setIsScrolling(true);
      
      if (e.deltaY > 0 && currentSection < totalSections - 1) {
        // 向下滚动
        setCurrentSection(prev => prev + 1);
      } else if (e.deltaY < 0 && currentSection > 0) {
        // 向上滚动
        setCurrentSection(prev => prev - 1);
      }
      
      setTimeout(() => setIsScrolling(false), 1000);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrolling) return;
      
      if (e.key === 'ArrowDown' && currentSection < totalSections - 1) {
        setIsScrolling(true);
        setCurrentSection(prev => prev + 1);
        setTimeout(() => setIsScrolling(false), 1000);
      } else if (e.key === 'ArrowUp' && currentSection > 0) {
        setIsScrolling(true);
        setCurrentSection(prev => prev - 1);
        setTimeout(() => setIsScrolling(false), 1000);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentSection, isScrolling]);

  // 从 AuthStore 获取登录状态
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // 计算内容的样式
  const contentStyle = {
    height: "100vh",
    width: "100%",
    overflow: "hidden"
  } as React.CSSProperties;

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ top: isLoggedIn ? "114px" : "60px", height: `calc(100vh - ${isLoggedIn ? "114px" : "60px"})` }}>
      <div 
        className="absolute inset-0 transition-transform duration-1000 ease-in-out"
        style={{ 
          transform: `translateY(-${currentSection * 100}%)`,
        }}
      >
      {/* Hero Section - 全屏背景图 */}
      <section className="h-full bg-cover bg-center bg-no-repeat relative flex items-center justify-center" style={{backgroundImage: "url('/images/f.png')"}}>
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 text-center text-white px-6 max-w-4xl">
          <h1 className="text-6xl lg:text-8xl font-bold mb-6 leading-tight">
            深圳大学
            <span className="block text-pink-800">竞赛交流平台</span>
          </h1>
          <p className="text-xl lg:text-2xl mb-8 leading-relaxed">
            一体化竞赛交流云平台，为深圳大学学生提供全面的竞赛服务
          </p>
          <div className="mb-8">
            <h3 className="text-2xl lg:text-3xl font-semibold text-pink-100">
              数智驱动 / 协同创新 / 生态赋能
            </h3>
          </div>
          <button disabled className="bg-pink-600 text-white px-12 py-4 rounded-full text-lg font-medium hover:bg-pink-700 transition-colors duration-300 shadow-lg">
            现在加入我们！
          </button>
        </div>
      </section>

      {/* Steps Section - 全屏 */}
      <section className="h-full bg-gray-50 flex items-center">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-pink-800 mb-6">
              参加竞赛需要考虑哪些问题？
            </h2>
            <p className="text-xl text-gray-600">
              我们为您梳理了完整的竞赛参与流程
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
            {[
              { title: '确定目标', desc: '明确参赛目标和期望收获', icon: '🎯' },
              { title: '时间协调', desc: '合理安排学习和竞赛时间', icon: '⏰' },
              { title: '备赛计划', desc: '制定详细的备赛计划', icon: '📋' },
              { title: '严选赛项', desc: '选择适合的竞赛项目', icon: '🏆' },
              { title: '导师指导', desc: '寻找专业导师指导', icon: '👨‍🏫' },
              { title: '团队合作', desc: '组建高效的竞赛团队', icon: '🤝' }
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-3xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 h-48 flex flex-col justify-center">
                  <div className="text-5xl mb-4">{step.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{step.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
                </div>
                {index < 5 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-pink-400 text-3xl">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Competition Section - 全屏 */}
      <section className="h-full bg-white flex items-center">
        <div className="container mx-auto px-6 max-h-screen overflow-hidden">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">深圳大学热门竞赛</h2>
            <p className="text-lg text-gray-600">发现最适合你的竞赛项目</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: '全国大学生数学建模竞赛',
                location: '深圳大学',
                team: '3人团队',
                duration: '3天时间',
                category: '本科组',
                price: '免费',
                image: '/images/e.png'
              },
              {
                title: 'ACM程序设计竞赛',
                location: '深圳大学',
                team: '3人团队',
                duration: '5小时',
                category: '算法竞赛',
                price: '免费',
                image: '/images/tzbcy.png'
              },
              {
                title: '互联网+创新创业大赛',
                location: '深圳大学',
                team: '5人团队',
                duration: '6个月',
                category: '创业组',
                price: '免费',
                image: '/images/sj.png'
              },
              {
                title: '蓝桥杯软件设计大赛',
                location: '深圳大学',
                team: '个人赛',
                duration: '4小时',
                category: '编程组',
                price: '￥200',
                image: '/images/lqb.png'
              }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex h-40">
                  <div className="w-2/5">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover"/>
                  </div>
                  <div className="w-3/5 p-6 flex flex-col justify-center">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
                    <p className="text-gray-600 mb-3 text-sm">📍 {item.location}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                      <span>👥 {item.team}</span>
                      <span>⏱️ {item.duration}</span>
                      <span>🏷️ {item.category}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">主办方：深圳大学</span>
                      <span className="text-lg font-bold text-pink-600">{item.price}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <button className="bg-pink-600 text-white px-8 py-3 rounded-full text-base font-medium hover:bg-pink-700 transition-colors duration-300 shadow-lg">
              查看全部竞赛
            </button>
          </div>
        </div>
      </section>

      {/* Features Section - 全屏背景图 */}
      <section className="h-full bg-cover bg-center relative flex items-center" style={{backgroundImage: "url('/images/g.png')"}}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">
              在这里有你所需要的一切
            </h2>
            <p className="text-2xl text-white/90 mb-4">
              学习基础 | 技能提升 | 计划制定
            </p>
            <p className="text-2xl text-white/90">
              心态调整 | 模拟演练 | 实战演练
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { title: '知识传承', desc: '通过"师带徒"形式，实现知识和经验的传承，提升团队整体竞争力。' },
              { title: '团队协作', desc: '增强团队协作能力，培养高效沟通和协作精神。' },
              { title: '竞赛实践', desc: '提供丰富的竞赛实践机会，提升实际操作能力。' },
              { title: '学术交流', desc: '促进学术交流和知识共享，拓宽学术视野。' }
            ].map((feature, index) => (
              <div key={index} className="bg-white/95 backdrop-blur-sm rounded-3xl p-10 text-center hover:bg-white transition-all duration-300 transform hover:-translate-y-3 shadow-xl">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed text-lg">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      </div>

      {/* 导航点 */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50">
        {Array.from({ length: totalSections }).map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (!isScrolling) {
                setIsScrolling(true);
                setCurrentSection(index);
                setTimeout(() => setIsScrolling(false), 1000);
              }
            }}
            className={`block w-3 h-3 rounded-full mb-4 transition-all duration-300 ${
              currentSection === index 
                ? 'bg-pink-600 scale-125' 
                : 'bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>

      {/* 滚动提示 */}
      {currentSection === 0 && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 text-white animate-bounce">
          <div className="flex flex-col items-center">
            <span className="text-sm mb-2">向下滚动</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
