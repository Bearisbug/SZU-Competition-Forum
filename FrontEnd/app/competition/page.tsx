"use client"

import React, { useState, useEffect } from "react"
import { Pagination, Button, Link } from "@heroui/react"
import toast from "react-hot-toast"
import { FilterSidebar, FilterOption } from "@/components/FilterSidebar"
import CompetitionCard, { Competition } from "@/components/Card/CompetitionCard"
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { API_BASE_URL } from "@/CONFIG";

type FilterCategory = "competition_type" | "organizer"

const filterCategories = [
  {
    title: "比赛类型",
    category: "competition_type" as FilterCategory,
    options: [
      { label: "黑客松", value: "Hackathon" },
      { label: "编程挑战", value: "Coding Challenge" },
      { label: "设计竞赛", value: "Design Competition" },
      { label: "数据科学", value: "Data Science" },
    ],
  },
  {
    title: "主办方",
    category: "organizer" as FilterCategory,
    options: [
      { label: "科技公司", value: "Tech Corp" },
      { label: "创新公司", value: "Innovation Inc" },
      { label: "编程大师", value: "Code Masters" },
      { label: "设计中心", value: "Design Hub" },
    ],
  },
]

export default function CompetitionListPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [filteredCompetitions, setFilteredCompetitions] = useState<Competition[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const competitionsPerPage = 6

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/competitions`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        })
        if (!res.ok) {
          throw new Error("获取比赛列表失败")
        }
        const data: Competition[] = await res.json()
        setCompetitions(data)
        setFilteredCompetitions(data)
      } catch (error) {
        console.error(error)
        toast.error("无法加载比赛列表")
      }
    }

    fetchCompetitions()
  }, [])

  const handleFilterChange = (filters: FilterOption[]) => {
    const newFilteredCompetitions = competitions.filter((competition) =>
      filters.every(
        (filter) =>
          competition[filter.category as keyof Competition] === filter.value
      )
    )
    setFilteredCompetitions(newFilteredCompetitions)
    setCurrentPage(1)
  }

  const indexOfLastCompetition = currentPage * competitionsPerPage
  const indexOfFirstCompetition = indexOfLastCompetition - competitionsPerPage
  const currentCompetitions = filteredCompetitions.slice(
    indexOfFirstCompetition,
    indexOfLastCompetition
  )

  return (
    <div className="container mx-auto p-4 flex mt-16">
      <FilterSidebar
        onFilterChange={handleFilterChange}
        //@ts-ignore
        filterCategories={filterCategories}
      />

      <div className="flex-1 ml-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">比赛列表</h1>
          <Link href="/competition/create">
          <Button color="primary">创建比赛</Button>
          </Link>
        </div>
        
        {filteredCompetitions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <X className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-center text-gray-500">没有符合条件的比赛，请尝试调整筛选条件或创建新的比赛。</p>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {currentCompetitions.map((competition) => (
              <motion.div
                key={competition.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <CompetitionCard competition={competition} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {filteredCompetitions.length > competitionsPerPage && (
          <div className="mt-6 flex justify-center">
            <Pagination
              total={Math.ceil(filteredCompetitions.length / competitionsPerPage)}
              page={currentPage}
              onChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  )
}

