  "use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MessageCircle, Trophy, Users, BookOpen } from "lucide-react"
import { Card, CardBody, CardHeader } from "@heroui/card"
import { Chip } from "@heroui/chip"
import { useAuthStore } from "@/lib/auth-guards"

export default function HomePage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  // 从 AuthStore 获取登录状态
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleTeamClick = () => router.push("/teams")
  const handleArticleClick = () => router.push("/article")
  const handleCompetitionClick = () => router.push("/competition")
  const handleStudyClick = () => router.push("/study")

  const navigationCards = [
    {
      title: "技术讨论",
      description: "分享技术见解，探讨前沿话题",
      icon: MessageCircle,
      color: "primary" as const,
      onClick: handleArticleClick,
      gradient: "from-blue-600 to-purple-600",
    },
    {
      title: "竞赛分享",
      description: "展示竞赛成果，交流比赛经验",
      icon: Trophy,
      color: "warning" as const,
      onClick: handleCompetitionClick,
      gradient: "from-amber-500 to-orange-600",
    },
    {
      title: "组建团队",
      description: "寻找志同道合的伙伴，共创未来",
      icon: Users,
      color: "success" as const,
      onClick: handleTeamClick,
      gradient: "from-green-500 to-teal-600",
    },
    {
      title: "学习心得",
      description: "记录学习历程，分享成长感悟",
      icon: BookOpen,
      color: "primary" as const,
      onClick: handleStudyClick,
      gradient: "from-purple-500 to-pink-600",
    },
  ]

  return (
    <div
      className="fixed inset-0 bg-gradient-to-b from-white to-gray-100 overflow-hidden flex flex-col"
      style={{ top: mounted ? (isLoggedIn ? "114px" : "60px") : "60px" }}
    >
      {/* 主要内容区域 */}
      <div className="container mx-auto px-6 py-8 flex-1 flex flex-col">
        {/* 标题区域 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-6">
            <Chip color="success" size="lg" className="text-sm font-medium" variant="shadow">
              欢迎来到
            </Chip>
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            互动交流平台
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            连接思想，分享智慧，在这里开启你的学习与交流之旅
          </p>
        </div>

        {/* 导航卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto flex-1">
          {navigationCards.map((card, index) => {
            const IconComponent = card.icon
            return (
              <Card
                key={index}
                isPressable
                isHoverable
                className="group h-80 bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
                onPress={card.onClick}
              >
                <CardHeader className="flex-col items-center pt-8 pb-4">
                  <div
                    className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    <IconComponent className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                    {card.title}
                  </h3>
                </CardHeader>
                <CardBody className="pt-0 px-6 pb-8 flex-col items-center text-center">
                  <p className="text-slate-600 text-base leading-relaxed mb-6">{card.description}</p>
                  <div
                    className={`px-6 py-3 rounded-lg bg-${card.color}/10 border border-${card.color}/20 group-hover:bg-${card.color}/20 transition-colors`}
                  >
                    <span className={`text-${card.color} font-medium flex items-center gap-2`}>
                      立即进入
                      <div className="w-2 h-2 rounded-full bg-current opacity-60 group-hover:opacity-100 transition-opacity" />
                    </span>
                  </div>
                </CardBody>
              </Card>
            )
          })}
        </div>

      </div>
    </div>
  )
}
