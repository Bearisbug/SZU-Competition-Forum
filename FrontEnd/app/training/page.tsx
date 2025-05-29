"use client";

import React, { useState } from "react";
import { Input } from "@heroui/react";
import { Search } from "lucide-react";

export default function OnlineLectureIntro() {
  const [searchTerm, setSearchTerm] = useState("");
  const carouselSlides = [
    {
      title: "从ACM惨败到区域赛银牌：我的三个月自救计划",
      desc: "我失败后重整旗鼓，终于逆袭成功……",
      author: "张明明",
      video: "video1.mp4",
    },
    {
      title: "黑客马拉松48小时：我们如何用ChatGPT忽悠评委？",
      desc: "AI编故事，我们编代码，谁说不行？",
      author: "李强",
      video: "video2.mp4",
    },
    {
      title: "开发大赛获奖后，我才看懂Git提交记录里的成长",
      desc: "那些看似微小的commit，其实是努力的印记。",
      author: "Tony",
      video: "video3.mp4",
    },
    {
      title: "用TypeScript写算法是一种怎样的体验？",
      desc: "静态类型的魅力远超预期，效率暴增！",
      author: "林夕",
      video: "video4.mp4",
    },
    {
      title: "你真的了解CSS Flex布局吗？",
      desc: "5分钟带你入门、10分钟掌握核心技巧。",
      author: "小王",
      video: "video5.mp4",
    },
  ];

  const filteredSlides = carouselSlides.filter(
    (slide) =>
      slide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      slide.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      slide.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/bg3.png')" }}
    >
      {/* 半透明背景遮罩 */}
      <div className="absolute inset-0 bg-white/80 z-0" />

      {/* 内容容器 */}
      <div className="relative z-10 container mx-auto p-8 flex">
          {/* 左下角固定分类栏 */}
          <div className="fixed bottom-0 left-0 bg-[#024d8f] text-white rounded-tr-lg p-4 shadow-lg w-64 h-[700px] z-20">
            <div className="mb-6 border-b-4 border-white pb-2">
              <h2 className="text-xl font-bold leading-snug">
                课程分类
                <br />
                <span className="text-sm font-normal">CATEGORY</span>
              </h2>
            </div>
            <ul className="space-y-16">
              <li className="hover:bg-red-900 hover:px-2 hover:py-1 hover:rounded transition-all duration-300">
                - 程序设计基础
                <br />
                <span className="text-sm">Fundamentals of Programming</span>
              </li>
              <li className="hover:bg-red-900 hover:px-2 hover:py-1 hover:rounded transition-all duration-300">
                - 算法基础
                <br />
                <span className="text-sm">Fundamentals of Algorithms</span>
              </li>
              <li className="hover:bg-red-900 hover:px-2 hover:py-1 hover:rounded transition-all duration-300">
                - 数据库基础
                <br />
                <span className="text-sm">Fundamentals of Databases</span>
              </li>
              {/* 可添加更多课程 */}
            </ul>
          </div>

        {/* 顶侧主内容区 */}
        <div className="flex-1 relative">
          {/* 文字说明部分 */}
          <div className="text-center mt-16">
            <h1 className="text-3xl font-bold mb-4 text-[#024d8f] inline-block pb-2 border-b-4 border-[#024d8f]">
              在线讲座
            </h1>
            <div className="text-[#024d8f] space-y-2 mt-4">
              <p>邀请经验丰富的导师入驻平台</p>
              <p>定期发布指导文章和直播课程</p>
              <p>为学生提供专业知识和竞赛技巧的传授</p>
            </div>
          </div>
            {/* 课程容器 */} 
<div className="mt-12 bg-white bg-opacity-95 rounded-lg shadow-lg p-8 max-w-5xl mx-auto">
  <div className="grid grid-cols-2 sm:grid-cols-2 gap-8">
    {filteredSlides.map((slide, index) => (
      <div
        key={index}
        className="flex flex-col bg-white rounded-md shadow-md overflow-hidden"
        style={{ maxHeight: '400px' }} // 最大高度限制
      >
        <video
          src={slide.video}
          controls
          className="w-full h-48 object-cover flex-shrink-0"
        />
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-bold text-[#024d8f] mb-2">{slide.title}</h3>
          <hr className="border-black mb-2" />
          <p
            className="text-sm text-gray-700 flex-grow overflow-hidden"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {slide.desc}
          </p>
          <div className="text-sm text-gray-500 mt-2 whitespace-nowrap overflow-hidden text-ellipsis">
            作者：{slide.author}
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

          {/* 内容块（课程信息等） 可自行扩展 */}
        </div>
        {/* 搜索框*/}
          <div className="absolute top-20 right-4 flex items-center gap-2 bg-[#024d8f] rounded-full px-4 py-1 shadow-md w-full h-10 max-w-xs z-20">
            <input
              type="text"
              placeholder="输入关键词"
              className="bg-[#024d8f] border-0 text-white placeholder-white focus:outline-none text-sm flex-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="text-white w-5 h-5" />
          </div>
      </div>
    </div>
  );
}