"use client";

import React, { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Search, ChevronDown } from "lucide-react";

export default function Resource() {
  const images = [
    { src: "/1.png", text: "竞赛资源" },
    { src: "/1.png", text: "学习资料" },
    { src: "/1.png", text: "项目案例" },
  ];

  // 模拟帖子数据
 const carouselSlides = [
  {
    title: "从ACM惨败到区域赛银牌：我的三个月自救计划",
    desc: "我失败后重整旗鼓，终于逆袭成功……",
    author: "张明明",
    image: "bg1.png",
  },
  {
    title: "黑客马拉松48小时：我们如何用ChatGPT忽悠评委？",
    desc: "AI编故事，我们编代码，谁说不行？",
    author: "李强",
    image: "bg2.png",
  },
  {
    title: "开发大赛获奖后，我才看懂Git提交记录里的成长",
    desc: "那些看似微小的commit，其实是努力的印记。",
    author: "Tony",
    image: "bg3.png",
  },
  {
    title: "用TypeScript写算法是一种怎样的体验？",
    desc: "静态类型的魅力远超预期，效率暴增！",
    author: "林夕",
    image: "bg1.png",
  },
  {
    title: "你真的了解CSS Flex布局吗？",
    desc: "5分钟带你入门、10分钟掌握核心技巧。",
    author: "小王",
    image: "bg2.png",
  },
];

  const scrollRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");

  //搜索
  const filteredSlides = carouselSlides.filter(
  (slide) =>
    slide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    slide.desc.toLowerCase().includes(searchTerm.toLowerCase())
);

  // 轮播控制
  const visibleCount = 3; // 一次展示 3 张
  const [currentIndex, setCurrentIndex] = useState(0);

  const maxIndex = Math.max(filteredSlides.length - visibleCount, 0);


  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  // 滚动到指定索引的卡片
  const scrollToIndex = (index: number) => {
  if (!scrollRef.current) return;

  // 选第一个子元素，确保是 HTMLElement
  const firstCard = scrollRef.current.children[0] as HTMLElement | undefined;
  if (!firstCard) return;

  const gap = 24; 
  const cardWidth = firstCard.clientWidth;
  const scrollLeft = index * (cardWidth + gap);

  scrollRef.current.scrollTo({
    left: scrollLeft,
    behavior: "smooth",
  });
};

  return (
    <div className="flex flex-col min-h-screen mt-[114px]">
      {/* 上方标题区 */}
      <div className="bg-white py-8 shadow-md">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-2 text-[#024d8f] inline-block pb-2 border-b-4 border-[#024d8f]">
            资源共享
          </h1>

          {/* 分类图标卡片 */}
          <div className="flex justify-center gap-8 mt-8">
            {images.map((image, index) => (
              <Card
                key={index}
                className="w-48 h-48 overflow-hidden relative group cursor-pointer"
              >
                <img
                  src={image.src}
                  alt={image.text}
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-[#024d8f] bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                  <span className="text-white text-xl font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    {image.text}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* 下方内容区 */}
      <div
        className="flex-1 bg-cover bg-center pt-12 pb-20 relative"
        style={{ backgroundImage: "url('/bg2.png')" }}
      >
        <div className="absolute inset-0 bg-[#024d8f] opacity-60 pointer-events-none"></div>
        <div className="relative container mx-auto px-4">
          {/* 标题与搜索框 */}
          <div className="max-w-6xl mx-auto mb-12 relative text-center">
          <h2 className="inline-block text-3xl font-bold text-white border-b-4 border-white pb-2">
            最新帖子
          </h2>

        <div
          className="absolute top-0 right-[-200px] flex items-center gap-2 bg-white rounded-full px-4 py-1 shadow-md w-full max-w-xs"
          style={{ height: "40px" }} 
        >
          <Search className="text-blue-700 w-5 h-5" />
          <Input
            type="text"
            placeholder="搜索关键词"
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentIndex(0);
            }}
          />
        </div>
      </div>


          {/* 帖子卡片区域 */}
          <div className="relative max-w-6xl mx-auto mt-12">
            {/* 左右箭头 */}
            <button
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className="absolute left-[-160px] top-1/2 -translate-y-1/2 z-20 w-24 h-64 flex items-center justify-center text-white disabled:opacity-30 p-0"
              aria-label="上一张"
            >
              <ChevronLeft size={100} />
            </button>
            <button
              onClick={nextSlide}
              disabled={currentIndex === maxIndex}
              className="absolute right-[-160px] top-1/2 -translate-y-1/2 z-20 w-24 h-64 flex items-center justify-center text-white disabled:opacity-30 p-0"
              aria-label="下一张"
            >
              <ChevronRight size={100} />
            </button>
      {/* 卡片滑动容器 */}
      <div className="overflow-hidden px-12">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${(100 / visibleCount) * currentIndex}%)`,
            width: `${(100 / visibleCount) * carouselSlides.length}%`,
          }}
        >
          {filteredSlides.map((slide, index) => (
              <div
                key={index}
                className="w-1/5 px-2 flex-shrink-0"
                style={{ minWidth: "20%" }}
              >
                <Card className="shadow-md hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-0">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-40 object-cover rounded-t-md"
                    />
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-3">{slide.title}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-3">{slide.desc}</p>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-sm text-gray-500">作者：{slide.author}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
