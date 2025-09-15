'use client';
import React, { useEffect, useState } from 'react';
import CompetitionCard from '@/components/Card/CompetitionCard';
import {Competition, CompetitionLevel} from "@/modules/competition/competition.model";

export default function HomePage() {
  //临时处理，我认为不应当如此，尤其是在level和subtype都已经后端化的情况
  //但是目前要求competition相关后端请求仅在登录时获得token才可发起，故姑且将这一套静态数据放在这里
  const competitions: Competition[] = [
    {
      id: 1,
      name: '全国大学生数学建模竞赛',
      sign_up_start_time: new Date('2024-08-01').toISOString(),
      sign_up_end_time: new Date('2024-09-01').toISOString(),
      competition_start_time: new Date('2024-09-10').toISOString(),
      competition_end_time: new Date('2024-09-13').toISOString(),
      details: '全国大学生数学建模竞赛是面向全国大学生的群众性科技活动，旨在激励学生学习数学的积极性。',
      organizer: '深圳大学',
      competition_level: 'I类竞赛',
      competition_subtype: '数学建模',
      cover_image: '/hero-background.png',
      created_at: new Date('2024-01-01').toISOString(),
      updated_at: new Date('2024-01-01').toISOString(),
    },
    {
      id: 2,
      name: 'ACM程序设计竞赛',
      sign_up_start_time: new Date('2024-09-01').toISOString(),
      sign_up_end_time: new Date('2024-10-01').toISOString(),
      competition_start_time: new Date('2024-10-15').toISOString(),
      competition_end_time: new Date('2024-10-15').toISOString(),
      details: 'ACM国际大学生程序设计竞赛是世界上公认的规模最大、水平最高的国际大学生程序设计竞赛。',
      organizer: '深圳大学',
      competition_level: 'I类竞赛',
      competition_subtype: '程序设计',
      cover_image: '/function-demo.png',
      created_at: new Date('2024-01-01').toISOString(),
      updated_at: new Date('2024-01-01').toISOString()
    },
    {
      id: 3,
      name: '互联网+创新创业大赛',
      sign_up_start_time: new Date('2024-03-01').toISOString(),
      sign_up_end_time: new Date('2024-05-01').toISOString(),
      competition_start_time: new Date('2024-06-01').toISOString(),
      competition_end_time: new Date('2024-08-01').toISOString(),
      details: '中国国际"互联网+"大学生创新创业大赛旨在深化高等教育综合改革，激发大学生的创造力。',
      organizer: '深圳大学',
      competition_level: 'II类竞赛',
      competition_subtype: '创业实践',
      cover_image: '/big-data-institute.png',
      created_at: new Date('2024-01-01').toISOString(),
      updated_at: new Date('2024-01-01').toISOString()
    }
  ];

  const [currentSection, setCurrentSection] = useState(0);
  const [competitionLevels, setCompetitionLevels] = useState<CompetitionLevel[] | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const totalSections = 5;

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      if (isScrolling) return;
      
      setIsScrolling(true);
      
      if (e.deltaY > 0 && currentSection < totalSections - 1) {
        // 向下滚动
        setCurrentSection(prev => Math.min(prev + 1, totalSections - 1));
      } else if (e.deltaY < 0 && currentSection > 0) {
        // 向上滚动
        setCurrentSection(prev => Math.max(prev - 1, 0));
      } else {
        // 如果已经在边界，直接结束滚动状态
        setIsScrolling(false);
        return;
      }
      
      setTimeout(() => setIsScrolling(false), 1000);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrolling) return;
      
      if (e.key === 'ArrowDown' && currentSection < totalSections - 1) {
        setIsScrolling(true);
        setCurrentSection(prev => Math.min(prev + 1, totalSections - 1));
        setTimeout(() => setIsScrolling(false), 1000);
      } else if (e.key === 'ArrowUp' && currentSection > 0) {
        setIsScrolling(true);
        setCurrentSection(prev => Math.max(prev - 1, 0));
        setTimeout(() => setIsScrolling(false), 1000);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentSection, isScrolling, totalSections]);

  // 从 AuthStore 获取登录状态
  //const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return (
    <>
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <div className="relative flex-1 min-h-0 overflow-hidden">
      <div 
        className="absolute inset-0 transition-transform duration-1000 ease-in-out"
        style={{ 
          transform: `translateY(-${currentSection * 100}%)`,
        }}
      >
      {/* 第一页 - 火种云平台主页 */}
      <section className="h-full bg-cover bg-center bg-no-repeat relative flex items-center justify-center" style={{backgroundImage: "url('/hero-background.png')"}}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 text-center px-6 max-w-6xl">
          <div className="mb-8">
            <p className="text-3xl font-medium tracking-[16.5px] mb-4 text-white opacity-70">欢迎来到</p>
            <h1 className="text-xl lg:text-9xl font-bold mb-8 text-white">
              火种云平台
            </h1>
          </div>
          <div className="mt-8">
            <h2 className="text-4xl font-bold text-[#389ACF] mb-4">
              深圳大学计算机与软件学院竞赛交流平台
            </h2>
          </div>
        </div>
      </section>

      {/* 第二页 - 研究中心选择 */}
      <section className="h-full bg-white flex items-center py-4">
        <div className="container mx-auto px-6">
          <div className="text-center mb-6">
            <p className="text-sm font-semibold tracking-[8px] text-gray-500 mb-2">RESEARCH CENTER</p>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">选择你的心仪研究所</h2>
          </div>
          
          {/* 三角形布局：第一行1个，第二行2个，第三行3个 */}
          <div className="max-w-4xl mx-auto">
            {/* 第一行 - 1个 */}
            <div className="flex justify-center mb-4">
              <div className="flex flex-col items-center">
                <a href="https://vcc.tech/index" target="_blank" rel="noopener noreferrer">
                  <img src="/visualization-computing-center.png" alt="可视计算研究中心" className="w-28 h-28 rounded-full mb-2 object-cover"/>
                  <h3 className="text-xs font-semibold tracking-[4px] text-gray-500">可视计算研究中心</h3>
                </a>
              </div>
            </div>

            {/* 第二行 - 2个 */}
            <div className="flex justify-center gap-12 mb-4">
              <div className="flex flex-col items-center">
                <a href="https://aisc.szu.edu.cn/" target="_blank" rel="noopener noreferrer">
                  <img src="/intelligent-service-center.png" alt="智能服务计算研究中心" className="w-28 h-28 rounded-full mb-2 object-cover"/>
                  <h3 className="text-xs font-semibold tracking-[2px] text-gray-500">智能服务计算研究中心</h3>
                </a> 
              </div>
              <div className="flex flex-col items-center">
                <a href="https://bigdata.szu.edu.cn/" target="_blank" rel="noopener noreferrer">
                  <img src="/big-data-institute.png" alt="大数据技术与应用研究所" className="w-28 h-28 rounded-full mb-2 object-cover"/>
                  <h3 className="text-xs font-semibold tracking-[2px] text-gray-500">大数据技术与应用研究所</h3>
                </a>
              </div>
            </div>

            {/* 第三行 - 3个 */}
            <div className="flex justify-center gap-8">
              <div className="flex flex-col items-center">
                <a href="https://csse.szu.edu.cn/cv/" target="_blank" rel="noopener noreferrer">
                  <img src="/computer-vision-center.png" alt="计算机视觉研究所" className="w-28 h-28 rounded-lg mb-2 object-cover"/>
                  <h3 className="text-xs font-semibold tracking-[3px] text-gray-500">计算机视觉研究所</h3>
                </a>
              </div>
              <div className="flex flex-col items-center">
                <a href="https://nhpcc.szu.edu.cn/" target="_blank" rel="noopener noreferrer">
                  <img src="/high-performance-center.png" alt="高性能计算研究所" className="w-28 h-28 rounded-full mb-2 object-cover"/>
                  <h3 className="text-xs font-semibold tracking-[3px] text-gray-500">高性能计算研究所</h3>
                </a>
              </div>
              <div className="flex flex-col items-center">
                <a href="https://futuremedia.szu.edu.cn/" target="_blank" rel="noopener noreferrer">
                  <img src="/future-media-center.png" alt="未来媒体技术与计算研究所" className="w-28 h-28 rounded-lg mb-2 object-cover"/>
                  <h3 className="text-xs font-semibold tracking-[1px] text-gray-500">未来媒体技术与计算研究所</h3>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 第三页 - 功能介绍 */}
      <section className="h-full bg-white flex items-center py-4">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
            <div className="order-2 lg:order-1">
              <img src="/function-demo.png" alt="功能展示" className="w-full rounded-xl shadow-lg"/>
            </div>
            
            <div className="order-1 lg:order-2">
              <p className="text-sm font-semibold tracking-[8px] text-gray-500 mb-2">Function</p>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">在这里，结识你的伙伴</h2>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <span className="text-2xl font-medium text-gray-400 tracking-[1.3px]">01</span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">组队功能</h3>
                    <p className="text-gray-600 leading-relaxed text-sm">
                      快速找到志同道合的队友，智能匹配系统帮助你组建高效的竞赛团队。
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="text-2xl font-medium text-gray-400 tracking-[1.3px]">02</span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">参加竞赛</h3>
                    <p className="text-gray-600 leading-relaxed text-sm">
                      浏览各类竞赛信息，一键报名参加，获取最新的竞赛动态和通知。
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="text-2xl font-medium text-gray-400 tracking-[1.3px]">03</span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">经验分享</h3>
                    <p className="text-gray-600 leading-relaxed text-sm">
                      分享竞赛经验和获奖作品，学习优秀团队的成功经验和技术方案。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 第四页 - 竞赛展示 */}
      <section className="h-full bg-white flex items-center py-4">
        <div className="container mx-auto px-6">
          <div className="text-center mb-6">
            <p className="text-sm font-semibold tracking-[8px] text-gray-500 mb-2">COMPETITIONS</p>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">竞赛等你参与！</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {competitions.map((competition) => (
              <CompetitionCard
                key={competition.id}
                competition={competition}
                onClick={(id) => console.log('点击竞赛:', id)} />
            ))}
          </div>
          
          <div className="text-center mt-6">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors duration-300">
              查看全部竞赛
            </button>
          </div>
        </div>
      </section>

      {/* 第五页 - 前辈箴言 */}
      <section className="h-full bg-gray-100 flex flex-col justify-center py-4">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8">
            <p className="text-sm font-semibold tracking-[8px] text-gray-500 mb-2">WISDOM</p>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">前辈箴言</h2>
            <p className="text-gray-600 text-sm">聆听前辈的智慧，点亮前进的明灯</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="relative h-[28rem] overflow-hidden">
              <div className="absolute inset-0 overflow-y-auto snap-y snap-mandatory hide-scrollbar space-y-4 p-2">
                {[
                  {
                    name: '张教授',
                    title: '计算机视觉研究所 教授',
                    content: '做学问如登山，一步一个脚印。在竞赛中不要急于求成，扎实的基础是成功的关键。记住，每一次失败都是通向成功的垫脚石。',
                    avatar: '/12.svg'
                  },
                  {
                    name: '李博士',
                    title: '大数据研究所 副教授',
                    content: '团队合作是竞赛制胜的法宝。学会倾听队友的想法，发挥每个人的长处。一个人可以走得很快，但一群人可以走得更远。',
                    avatar: '/15.svg'
                  },
                  {
                    name: '王老师',
                    title: '智能服务计算中心 研究员',
                    content: '创新来源于对问题的深度思考。不要满足于表面的解决方案，要敢于挑战传统思维，用全新的角度看待问题。',
                    avatar: '/19.svg'
                  },
                  {
                    name: '陈院士',
                    title: '高性能计算研究所 院士',
                    content: '技术日新月异，但学习的热情永远不能消退。保持好奇心，拥抱变化，让自己成为终身学习者。',
                    avatar: '/12.svg'
                  },
                  {
                    name: '刘教授',
                    title: '未来媒体技术研究所 教授',
                    content: '在追求技术卓越的同时，不要忘记初心。技术是为了服务人类，让世界变得更美好。这是我们做研究的根本目的。',
                    avatar: '/15.svg'
                  }
                ].map((wisdom, index) => (
                  <div 
                    key={index} 
                    className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 backdrop-blur-sm rounded-xl p-8 relative snap-start h-[26rem] flex flex-col justify-between border border-blue-200/30 flex-shrink-0"
                  >
                    <div>
                      <div className="text-5xl text-blue-400 opacity-40 font-bold mb-6">💡</div>
                      <p className="text-gray-800 text-lg leading-relaxed font-medium">
                        "{wisdom.content}"
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <img 
                        src={wisdom.avatar} 
                        alt={wisdom.name} 
                        className="w-16 h-16 rounded-full object-cover border-2 border-blue-300"
                      />
                      <div>
                        <h4 className="font-bold text-gray-900 text-xl">{wisdom.name}</h4>
                        <p className="text-base text-blue-600 font-medium">{wisdom.title}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-2">
                {[0, 1, 2, 3, 4].map((dot) => (
                  <button
                    key={dot}
                    className="w-2 h-8 rounded-full bg-blue-200 hover:bg-blue-400 transition-all opacity-60 hover:opacity-100"
                    onClick={() => {
                      const container = document.querySelector('.overflow-y-auto');
                      const cards = container?.querySelectorAll('.snap-start');
                      
                      if (container && cards && cards[dot]) {
                        cards[dot].scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="relative w-full h-[28rem] bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl overflow-hidden shadow-lg">
                <img 
                  src="/user-background.png"
                  alt="前辈箴言" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <h3 className="text-2xl font-bold mb-2">追求卓越，永不止步</h3>
                  <p className="text-sm opacity-90">在知识的海洋中遨游，在竞赛的舞台上闪耀</p>
                </div>
              </div>
            </div>
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
              if (!isScrolling && index >= 0 && index < totalSections) {
                setIsScrolling(true);
                setCurrentSection(Math.min(Math.max(index, 0), totalSections - 1));
                setTimeout(() => setIsScrolling(false), 1000);
              }
            }}
            className={`block w-3 h-3 rounded-full mb-2 transition-all duration-300 ${
              currentSection === index 
                ? 'scale-125' 
                : 'bg-gray-800 hover:bg-white/80'
            }`}
            style={currentSection === index ? { backgroundColor: '#1F4C8A' } : {}}            
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
    </>
  );
}
