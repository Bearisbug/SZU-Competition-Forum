'use client';
import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/auth-guards';
import { Play, CheckCircle, Users, Trophy, Star, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const [currentSection, setCurrentSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const totalSections = 8;

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

      {/* Competition Results Features Section */}
      <section className="h-full bg-gray-50 flex items-center">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              竞赛成果特色
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              展示优秀竞赛团队的创新成果，为学生提供学习和交流的平台
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                获奖项目展示
              </h3>
              <p className="text-gray-600 leading-relaxed">
                展示各类竞赛的获奖项目，包括项目介绍、技术方案和创新点，为其他团队提供参考
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                团队经验分享
              </h3>
              <p className="text-gray-600 leading-relaxed">
                优秀团队分享竞赛经验、团队协作方法和项目管理技巧，帮助新团队快速成长
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                创新技术展示
              </h3>
              <p className="text-gray-600 leading-relaxed">
                展示项目中使用的创新技术和解决方案，推动技术交流和知识共享
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Organization Section */}
      <section className="h-full bg-white flex items-center">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                最快速的方式
                <br />
                组织竞赛团队
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                通过我们的平台快速找到志同道合的队友，组建高效的竞赛团队。智能匹配系统帮助你找到最合适的合作伙伴。
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200">
                立即组队
              </button>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">数学建模竞赛团队</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">ACM程序设计竞赛</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">创新创业大赛项目</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
                    <div className="w-5 h-5 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-blue-700 font-medium">电子设计竞赛 (进行中)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="h-full bg-gray-50 flex items-center">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              合作伙伴
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              与知名企业和机构合作，为学生提供更多实践机会和就业资源
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex items-center justify-center">
              <div className="text-2xl font-bold text-gray-400">腾讯</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex items-center justify-center">
              <div className="text-2xl font-bold text-gray-400">阿里巴巴</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex items-center justify-center">
              <div className="text-2xl font-bold text-gray-400">华为</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex items-center justify-center">
              <div className="text-2xl font-bold text-gray-400">字节跳动</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex items-center justify-center">
              <div className="text-2xl font-bold text-gray-400">百度</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex items-center justify-center">
              <div className="text-2xl font-bold text-gray-400">美团</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex items-center justify-center">
              <div className="text-2xl font-bold text-gray-400">滴滴</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex items-center justify-center">
              <div className="text-2xl font-bold text-gray-400">小米</div>
            </div>
          </div>

          <div className="text-center mt-12">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200">
              查看所有合作伙伴
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="h-full bg-white flex items-center">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              学生评价
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              听听参与竞赛的学生们对平台的真实评价和使用体验
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-blue-50 rounded-2xl p-8 md:p-12 text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-white font-bold text-xl">深大</span>
              </div>
              <blockquote className="text-xl md:text-2xl text-gray-700 mb-6 leading-relaxed">
                "通过深大竞赛论坛，我们团队不仅找到了优秀的队友，还学习到了很多实用的竞赛经验。平台上的成果展示给了我们很大的启发，最终在全国大学生数学建模竞赛中获得了一等奖。"
              </blockquote>
              <div className="text-gray-600">
                <div className="font-semibold">张同学</div>
                <div className="text-sm">计算机科学与技术专业</div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200">
              查看更多评价
            </button>
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
            className={`block w-3 h-3 rounded-full mb-2 transition-all duration-300 ${
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
