'use client';
import React from 'react';
import { useRouter } from 'next/navigation'; // 修改为新的导航方式

export default function HomePage() {
  const router = useRouter();

  // 左侧导航点击处理
  const handleNavigation = (type: string, id: string) => {
    // 根据分类跳转不同页面
    switch(type) {
      case 'I类':
        router.push(`/competition/${id}`);
        break;
      case 'II类':
        router.push(`/competition/${id}`);
        break;
      case 'III类':
        router.push(`/competition/${id}`);
        break;
      default:
        router.push('/');
    }
  };
  // 竞赛数据配置
  const competitions = {
    I类: [
      { id: '1', name: '中国“互联网+”大学生创新创业大赛全国总决赛' },
      { id: '2', name: '“挑战杯”全国大学生课外学术科技作品竞赛' },
      { id: '3', name: '“挑战杯”中国大学生创业计划竞赛' }
    ],
    II类: [
      { id: 'A', name: '(A) 类' },
      { id: 'B', name: '(B) 类' },
      { id: 'C', name: '(C) 类' }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="relative min-h-[900px] w-full">
        {/* 背景图层 */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{ backgroundImage: "url('/images/e.png')" }}
        >
          {/* 半透明遮罩 */}
          <div className="absolute inset-0 bg-white/50 "></div>
        </div>
        <div className="text-center mb-12">
          <div className="absolute inset-20 ">
            <div className="text-center">
              <h1 className="text-5xl font-bold text-blue-900 mb-0">
                竞赛信息
              </h1>
              <h2 className="text-3xl font-bold text-blue-900 mb-20">
                ———————
              </h2>
            </div>
          </div>
        </div>

        {/* 左侧分类导航 - 修改后的版本 */}
        <div className="absolute top-20 left-0 p-4 bg-blue-900 text-white rounded-lg z-30 w-1/6 min-h-screen">
          {/* I 类 */}
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-3 border-b-4 border-white/50 pb-2">I 类</h3>
            <ul className="divide-y divide-white/20">
              {competitions.I类.map((item) => (
                <li 
                  key={item.id}
                  onClick={() => handleNavigation('I类', item.id)}
                  className="group py-3 px-3 hover:bg-pink-900 rounded-md transition-all duration-200 cursor-pointer"
                >
                  {item.name}
                </li>
              ))}
            </ul>
          </div>

          {/* II 类 */}
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-3 border-b-4 border-white/50 pb-2">II 类</h3>
            <ul className="divide-y divide-white/20">
              {competitions.II类.map((item) => (
                <li
                  key={item.id}
                  onClick={() => handleNavigation('II类', item.id)}
                  className="group py-3 px-3 hover:bg-pink-900 rounded-md transition-all duration-200 cursor-pointer"
                >
                  {item.name}
                </li>
              ))}
            </ul>
          </div>

          {/* 分隔线 */}
          <hr className="border-t border-white/20 my-4" />

          {/* III 类 */}
          <div>
            <h3 className="text-xl font-bold mb-3 border-b-4 border-white/50 pb-2">III 类</h3>
            {/* 可以在这里添加III类内容 */}
          </div>
        </div>

        
        <div className="absolute top-[200px] right-0 w-3/4 h-full z-10">
          <div className="flex flex-col gap-2 mt-8 w-full md:w-3/4">
            <div className="bg-white p-4 rounded shadow">
              <img src="/images/a.jpg" alt="Florence Hills Competition" className="w-full h-48 object-cover" />
              <h4 className="text-lg font-bold mt-2">Florence Hills Competition</h4>
              <p className="text-gray-600">Prize 25,000 €</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <img src="/images/b.jpg" alt="Mujassam Watan Urban Sculpture Challenge" className="w-full h-48 object-cover" />
              <h4 className="text-lg font-bold mt-2">Mujassam Watan Urban Sculpture Challenge</h4>
              <p className="text-gray-600">Prize 50,000 €</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <img src="/images/c.jpg" alt="Florence Hills Competition" className="w-full h-48 object-cover" />
              <h4 className="text-lg font-bold mt-2">Florence Hills Competition</h4>
              <p className="text-gray-600">Prize 25,000 €</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <img src="/images/d.jpg" alt="Mujassam Watan Urban Sculpture Challenge" className="w-full h-48 object-cover" />
              <h4 className="text-lg font-bold mt-2">Mujassam Watan Urban Sculpture Challenge</h4>
              <p className="text-gray-600">Prize 50,000 €</p>
            </div>
          </div>
        </div>
      </header>
      
      <div className="max-w-10xl mx-auto">
        {/* Section 2 */}
        
        <section 
            className="bg-cover bg-center bg-no-repeat relative overflow-hidden min-h-[700px] w-full" 
            style={{backgroundImage: "url('/images/e.png')"}}>
          <div className="container mx-auto px-6 py-20 z-10">
            <div className="absolute inset-0 bg-white/50 "></div>
          </div>
          
        </section>
        
        <hr className="border-gray-200" />
      </div>
      
    </div>
  );
}