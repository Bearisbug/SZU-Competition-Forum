"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from '@/components/AuthStore';

export default function AchievementShowcase() {
  const carouselSlides = [
    { src: "/1.png", title: "优秀奖" },
    { src: "/1.png", title: "三等奖" },
    { src: "/1.png", title: "一等奖" },
    { src: "/1.png", title: "二等奖" },
    { src: "/1.png", title: "鼓励奖" },
  ];

  const [current, setCurrent] = useState(0);
  const [mounted, setMounted] = useState(false);

  // 从 AuthStore 获取登录状态
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselSlides.length]);

const getPositionClass = (index: number) => {
  const diff = (index - current + carouselSlides.length) % carouselSlides.length;

  switch (diff) {
    case 0: // 中间
      return "z-30 scale-100 translate-x-0";
    case 1: // 中间右边
      return "z-20 scale-90 translate-x-40";
    case 2: // 最右边
      return "z-10 scale-75 translate-x-60 opacity-50";
    case carouselSlides.length - 1: // 中间左边
      return "z-20 scale-90 -translate-x-40";
    case carouselSlides.length - 2: // 最左边
      return "z-10 scale-75 -translate-x-60 opacity-50";
    default:
      return "hidden";
  }
};


  const elites = [
    { src: "/1.png", name: "张三", award: "全国一等奖" },
    { src: "/1.png", name: "李四", award: "省级二等奖" },
    { src: "/1.png", name: "王五", award: "市级三等奖" },
  ];

  return (
    <div className="min-h-screen">
      {/* 成果展示 */}
      <section className="bg-white py-12" style={{ marginTop: mounted ? (isLoggedIn ? "114px" : "60px") : "60px" }}>
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-[#024d8f] inline-block pb-2 border-b-4 border-[#024d8f]">
            成果展示
          </h1>

          {/* 自动轮播图片行 */}
          <div className="relative w-full max-w-6xl mx-auto mt-16 h-72 flex items-center justify-center">
            {carouselSlides.map((item, index) => {
              const pos = getPositionClass(index);
              const isCenter = index === current;

              return (
               <div
                key={index}
                className={`absolute transition-all duration-700 ease-in-out ${pos}`}>
                <div className="relative">
                    <img
                    src={item.src}
                    alt={item.title || `奖项 ${index + 1}`}
                    className={`rounded-md object-cover shadow-lg ${
                        isCenter ? "w-64 h-64" : "w-40 h-40"
                    }`}
                    />
                    {isCenter && item.title && (
                    <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-white text-[#024d8f] font-semibold px-4 py-1 rounded shadow z-50">
                    {item.title}
                    </div>
                    )}
                </div>
                </div>
              );
            })}
          </div>

          {/* 了解更多 */}
          <div className="mt-16">
            <span
              className="inline-block px-6 py-2 border-2 border-[#024d8f] text-[#024d8f] font-semibold rounded cursor-pointer hover:bg-[#024d8f] hover:text-white transition-colors"
              role="button"
              tabIndex={0}
            >
              了解更多
            </span>
          </div>
        </div>
      </section>

      {/* 获奖精英 */}
      <div className="container mx-auto px-4 mt-20 text-center">
        <h2 className="text-4xl font-bold text-[#024d8f] inline-block pb-2 border-b-4 border-[#024d8f]">
          获奖精英
        </h2>
      </div>

      <section className="bg-[#024d8f] py-16 mt-8">
        <div className="container mx-auto px-4 text-center">
          {/* 精英展示区 */}
          <div className="flex justify-center items-center mt-12 w-11/12 max-w-7xl mx-auto text-white">
            {elites.map((elite, idx) => (
              <div
                key={idx}
                className={`flex flex-col items-center px-10 ${
                  idx !== elites.length - 1 ? "border-r border-white" : ""
                }`}
                style={{ flex: 1 }}
              >
                <img
                  src={elite.src}
                  alt={elite.name}
                  className="w-52 h-52 rounded-md object-cover mb-4"
                />
                <h3 className="text-xl font-semibold">{elite.name}</h3>
                <p className="mt-1 text-sm">{elite.award}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
