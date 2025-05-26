import React from 'react';
import './steps.css'; // 引入CSS文件

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* 标题卡片（带背景图） */}
      <header className="text-center relative overflow-hidden min-h-[700px] w-full">
        {/* 背景图层 */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{ backgroundImage: "url('/images/a.jpg')" }}
        >
          {/* 半透明遮罩 */}
          <div className="absolute inset-0 bg-black/10 "></div>
        </div>

        {/* 标题半透明卡片*/}
        <div className="text-center mb-48">
          <div className="absolute inset-10 flex items-center justify-center">
            <div className="w-full max-w-2xl h-80 bg-white/80 bg-opacity-70 shadow-lg flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-5xl font-bold text-pink-800 mb-2">
                  一体化竞赛交流云平台
                </h1>
                <h2 className="text-xl text-pink-800 mb-4">
                  Kiouting Nexus | Academic Competition Platform
                </h2>
                <h3 className="text-3xl text-pink-800">
                  数智驱动/协同创新/生态赋能
                </h3>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-10xl mx-auto ">
        {/* Section 1 */}
        <section className="bg-white p-8 shadow-md">
          <h2 className="text-4xl font-semibold text-pink-800">
            参加竞赛需要考虑哪些问题？
          </h2>
          
        </section>
        <section className="bg-gray-200 p-8 shadow-md">
          <div className="steps">
            {['确定目标', '时间协调', '备赛计划', '严选赛项', '导师指导', '团队合作'].map((step, index) => (
              <div key={index} className={`step ${index === 5 ? 'last-step' : ''}`}>
                {step}
              </div>
            ))}
          </div>
        </section>

        <hr className="border-gray-200" />

        {/* Section 2 */}
        <section className="bg-cover bg-center bg-no-repeat relative overflow-hidden min-h-[700px] w-full" style={{backgroundImage: "url('/images/d.jpg')"}}>
            <div className="container mx-auto px-6 py-20 z-10">
            <h2 className="text-3xl font-semibold text-white mb-6 text-center">
              在这里有你所需要的一切
            </h2>
            <h3 className="text-1xl font-semibold text-white mb-2 text-center">
              学习基础|技能提升|计划制定
            </h3>
            <h4 className="text-1xl font-semibold text-white mb-20 text-center">
              心态调整|模拟演练|实战演练
            </h4>
            <div className="grid md:grid-cols-4 gap-4 text-center">
              <div className="p-10 bg-white rounded-2xl">
                <h3 className="font-medium text-gray-800">知识传承</h3>
                <p className="text-sm text-gray-600">通过“师带徒”形式，实现知识和经验的传承，提升团队整体竞争力。</p>
              </div>
              <div className="p-10 bg-white rounded-2xl">
                <h3 className="font-medium text-gray-800">团队协作</h3>
                <p className="text-sm text-gray-600">增强团队协作能力，培养高效沟通和协作精神。</p>
              </div>
              <div className="p-10 bg-white rounded-2xl">
                <h3 className="font-medium text-gray-800">竞赛实践</h3>
                <p className="text-sm text-gray-600">提供丰富的竞赛实践机会，提升实际操作能力。</p>
              </div>
              <div className="p-10 bg-white rounded-2xl">
                <h3 className="font-medium text-gray-800">学术交流</h3>
                <p className="text-sm text-gray-600">促进学术交流和知识共享，拓宽学术视野。</p>
              </div>
              
            </div>
          </div>
        </section>

        <hr className="border-gray-200" />

        {/* Section 3 */}
        <section className="bg-white p-8 shadow-md">
          <h2 className="text-3xl font-semibold text-blue-900 mb-12 text-center">
            选择我们的四大优势
          </h2>
          <div className="grid gap-4 text-center ">
              <div className="p-10 bg-blue-700 rounded-2xl mx-auto">
                <h3 className="text-2xl text-white">信息整理</h3>
              </div>
              <div className="p-10 bg-blue-600 rounded-2xl mx-auto">
                <h3 className="text-2xl text-white">竞赛报名</h3>
              </div>
              <div className="p-10 bg-blue-500 rounded-2xl mx-auto">
                <h3 className="text-2xl text-white">学术交流</h3>
              </div>
              <div className="p-10 bg-blue-400 rounded-2xl mx-auto">
                <h3 className="text-2xl text-white">知识传承</h3>
              </div>
            </div>
        </section>
      </div>
    </div>
  );
}