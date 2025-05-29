'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';


export default function HomePage() {
  const router = useRouter();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handlePostClick = (postId: string) => {
    router.push(`/communication/${postId}`);
  };

  // 新增：处理团队卡片点击事件
  const handleTeamClick = () => {
    router.push('/communication/team');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* 标题卡片（带背景图） */}
      <header className="text-center relative overflow-hidden min-h-[700px] w-full">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/e.png"
            alt="背景图"
            fill
            className="object-cover object-center opacity-20"
            style={{ zIndex: -1 }}
          />
          <div className="absolute inset-0 bg-white/50"></div>
        </div>

        {/* 标题半透明卡片*/}
        <div className="text-center mb-12">
          <div className="absolute inset-20 ">
            <div className="text-center">
              <h1 className="text-5xl font-bold text-blue-900 mb-3">
                互动交流
              </h1>
              <div className="flex justify-center mb-10">
                <div className="w-48 h-1.5 bg-blue-900"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* 技术讨论 */}
                <div className="p-8">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-blue-800 mb-3">技术讨论</h3>
                </div>
                
                {/* 竞赛经验分享 */}
                <div className="p-8">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-blue-800 mb-3">竞赛经验分享</h3>
                </div>
                
                {/* 组建团队 - 添加点击事件 */}
                <div 
                  className="p-8 cursor-pointer rounded-lg transition-colors duration-300"
                  onClick={handleTeamClick}
                >
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-blue-800 mb-3">组建团队</h3>
                </div>
                
                {/* 学习心得 */}
                <div className="p-8">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-blue-800 mb-3">学习心得</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-10xl mx-auto">
        {/* Section 2 */}
        
        <section 
            className="bg-cover bg-center bg-no-repeat relative overflow-hidden min-h-[700px] w-full" 
            style={{backgroundImage: "url('/images/b.jpg')"}}>
          <div className="container mx-auto px-6 py-20 z-10">
            <h1 className="text-3xl font-semibold text-white mb-0 text-center mb-3">
              最新帖子
            </h1>
            <div className="flex justify-center mb-10">
              <div className="w-32 h-1 bg-white"></div>
            </div>
            <div className="grid md:grid-cols-3 gap-2 text-center max-w-10xl">
              {[1, 2, 3].map((postId) => (
              <div
                key={postId}
                onClick={() => handlePostClick(postId.toString())}
                className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="h-48 mb-4 overflow-hidden">
                  <Image 
                    src="/images/c.jpg" 
                    alt="知识传承"
                    width={300}  // 添加具体尺寸
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-medium text-gray-800">帖子标题</h3>
                <p className="text-sm text-gray-600 mt-2">帖子内容</p>
              </div>
              ))}
            </div>
          </div>
          
        </section>
        
        <hr className="border-gray-200" />
      </div>
    </div>
  );
}