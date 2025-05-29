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
          style={{ backgroundImage: "url('/images/f.png')" }}
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
        <section className="bg-cover bg-center bg-no-repeat relative overflow-hidden min-h-[700px] w-full" style={{backgroundImage: "url('/images/g.png')"}}>
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
          <div className="flex flex-col lg:flex-row gap-8 relative z-10">
            {/* 左侧文字框 */}
            <div className="flex-1 flex flex-col gap-8">
              <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg border border-blue-100 transition-all duration-300 hover:shadow-xl">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 text-blue-700 p-3 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-blue-800">信息整理</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  平台对发布的竞赛信息进行整理和展示，让用户能够快速找到自己感兴趣的竞赛项目。同时，平台还提供竞赛的历史数据和统计信息，帮助用户了解竞赛的发展趋势和竞争情况。
                </p>
              </div>
              
              <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg border border-blue-100 transition-all duration-300 hover:shadow-xl">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 text-blue-700 p-3 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-blue-800">知识传承</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  实现了知识传承、在线培训、成果展示、资源共享、竞赛模拟等服务。通过这些服务，为用户提供了学习和成长的平台。
                </p>
              </div>
            </div>
            
            {/* 中间四大优势 */}
            <div className="flex-1 flex flex-col gap-8">
              <div className="p-10 bg-blue-700 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1">
                <h3 className="text-2xl text-white font-bold text-center">信息整理</h3>
              </div>
              <div className="p-10 bg-blue-600 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1">
                <h3 className="text-2xl text-white font-bold text-center">竞赛报名</h3>
              </div>
              <div className="p-10 bg-blue-500 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1">
                <h3 className="text-2xl text-white font-bold text-center">学术交流</h3>
              </div>
              <div className="p-10 bg-blue-400 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1">
                <h3 className="text-2xl text-white font-bold text-center">知识传承</h3>
              </div>
            </div>
            
            {/* 右侧文字框 */}
            <div className="flex-1 flex flex-col gap-8">
              <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg border border-blue-100 transition-all duration-300 hover:shadow-xl">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 text-blue-700 p-3 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-blue-800">竞赛报名</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  为用户提供竞赛信息发布服务。用户可以在平台上发布竞赛的详细信息，包括竞赛的主题、时间、地点、参赛要求等，吸引更多的参与者。
                </p>
              </div>
              
              <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg border border-blue-100 transition-all duration-300 hover:shadow-xl">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 text-blue-700 p-3 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-blue-800">学术交流</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  整合了来自高校、企业、竞赛单位和学术论坛的各种数据。
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}