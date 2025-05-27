'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function HomePage() {
  const router = useRouter();

  const handlePostClick = (postId: string) => {
  router.push(`/communication/${postId}`);
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
        className="object-cover object-center"
        priority
        quality={75}
      />
      <div className="absolute inset-0 bg-white/50"></div>
    </div>

        {/* 标题半透明卡片*/}
        <div className="text-center mb-12">
          <div className="absolute inset-20 ">
            <div className="text-center">
              <h1 className="text-5xl font-bold text-blue-900 mb-0">
                互动交流
              </h1>
              <h2 className="text-3xl font-bold text-blue-900 mb-20">
                ———————
              </h2>
              <div className="grid md:grid-cols-4 gap-2 text-center max-w-10xl">
                <h3 className="font-medium text-blue-800 text-2xl">技术讨论</h3>
                <h4 className="font-medium text-blue-800 text-2xl">竞赛经验分享</h4>
                <h5 className="font-medium text-blue-800 text-2xl">组建团队</h5>
                <h6 className="font-medium text-blue-800 text-2xl">学习心得</h6>
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
            <h1 className="text-3xl font-semibold text-white mb-0 text-center">
              最新帖子
            </h1>
            <h2 className="text-2xl font-semibold text-white mb-10 text-center">
              ——————
            </h2>
            <div className="grid md:grid-cols-3 gap-2 text-center max-w-10xl">
              {[1, 2, 3].map((postId) => (
              <div
                key={postId}
                onClick={() => handlePostClick(postId.toString())}
                className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="h-48 mb-4 overflow-hidden">
                  <img 
                    src="/images/c.jpg" 
                    alt="知识传承" 
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