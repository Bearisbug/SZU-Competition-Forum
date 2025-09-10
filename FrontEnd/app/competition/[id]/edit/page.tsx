"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Input, Button, Select, SelectItem } from "@heroui/react"
import MyEditor from "@/components/IOEditor"
import toast from "react-hot-toast"
import { API_BASE_URL } from "@/CONFIG";
import { formatDate } from "@/lib/date";

// 强制动态渲染
export const dynamic = 'force-dynamic';

export type Competition = {
  id: number
  name: string
  sign_up_start_time: string
  sign_up_end_time: string
  competition_start_time: string
  competition_end_time: string
  details: string
  organizer: string
  cover_image: string
  created_at: string
  updated_at: string
}

function EditCompetitionPage() {
  const router = useRouter()
  const params = useParams() 
  const id = params.id  // Next.js 13 App Router: dynamic param is in params object

  const [name, setName] = useState("")
  const [details, setDetails] = useState("")
  const [organizer, setOrganizer] = useState("")
  // 移除比赛类型
  const [signUpStartTime, setSignUpStartTime] = useState("")
  const [signUpEndTime, setSignUpEndTime] = useState("")
  const [competitionStartTime, setCompetitionStartTime] = useState("")
  const [competitionEndTime, setCompetitionEndTime] = useState("")
  const [coverImage, setCoverImage] = useState("")
  const [coverPreview, setCoverPreview] = useState("")

  useEffect(() => {
    const fetchCompetition = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/competitions/detail/${id}`, {
          headers: {
            Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem("access_token") : ''}`,
          },
        })

        if (!response.ok) {
          throw new Error("比赛加载失败！")
        }

        const competition: Competition = await response.json()
        setName(competition.name)
        setDetails(competition.details)
        setOrganizer(competition.organizer)
        // 移除比赛类型
        // 仅保留到日，适配 date 输入
        setSignUpStartTime(formatDate(competition.sign_up_start_time))
        setSignUpEndTime(formatDate(competition.sign_up_end_time))
        setCompetitionStartTime(formatDate(competition.competition_start_time))
        setCompetitionEndTime(formatDate(competition.competition_end_time))
        setCoverImage(competition.cover_image)
        setCoverPreview(competition.cover_image)

        toast.success("比赛信息加载成功！")
      } catch (error) {
        console.error("加载比赛错误:", error)
        toast.error("比赛信息加载失败，请稍后重试！")
      }
    }

    if (id) {
      fetchCompetition()
    }
  }, [id])

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      toast.error("请选择图片文件！")
      return
    }

    const formData = new FormData()
    formData.append("image", file)

    try {
      const response = await fetch(`${API_BASE_URL}/upload_image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem("access_token") : ''}`,
        },
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "上传图片失败！")
      }

      const result = await response.json()
      const imageUrl = result.data.url

      setCoverImage(imageUrl)
      setCoverPreview(URL.createObjectURL(file))
      toast.success("图片上传成功！")
    } catch (error) {
      console.error("图片上传错误:", error)
      toast.error("上传图片失败，请重试！")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !name ||
      !details ||
      !organizer ||
      !signUpStartTime ||
      !signUpEndTime ||
      !competitionStartTime ||
      !competitionEndTime
    ) {
      toast.error("请填写所有必填字段！")
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/competitions/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem("access_token") : ''}`,
        },
        body: JSON.stringify({
          name,
          details,
          organizer,
          sign_up_start_time: signUpStartTime,
          sign_up_end_time: signUpEndTime,
          competition_start_time: competitionStartTime,
          competition_end_time: competitionEndTime,
          cover_image: coverImage,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "更新比赛失败！")
      }

      toast.success("比赛更新成功！")
      router.push(`/competition/${id}`)
    } catch (error) {
      console.error("更新比赛错误:", error)
      toast.error("更新比赛失败，请重试！")
    }
  }

  return (
    <div className="flex-1 min-h-0 container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">编辑比赛</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="比赛名称"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          label="主办方"
          value={organizer}
          onChange={(e) => setOrganizer(e.target.value)}
          required
        />

        {/* 移除比赛类型选择 */}

        <Input
          label="报名开始时间"
          type="date"
          value={signUpStartTime}
          onChange={(e) => setSignUpStartTime(e.target.value)}
          required
        />

        <Input
          label="报名结束时间"
          type="date"
          value={signUpEndTime}
          onChange={(e) => setSignUpEndTime(e.target.value)}
          required
        />

        <Input
          label="比赛开始时间"
          type="date"
          value={competitionStartTime}
          onChange={(e) => setCompetitionStartTime(e.target.value)}
          required
        />

        <Input
          label="比赛结束时间"
          type="date"
          value={competitionEndTime}
          onChange={(e) => setCompetitionEndTime(e.target.value)}
          required
        />

        <div>
          <label className="block mb-2">封面图片</label>
          {coverPreview && (
            <img
              src={coverPreview}
              alt="封面预览"
              className="mb-2 w-32 h-32 object-cover border"
            />
          )}
          <Input type="file" accept="image/*" onChange={handleImageUpload} />
          {coverImage && (
            <p className="text-sm text-gray-500">上传成功的 URL: {coverImage}</p>
          )}
        </div>

        <div>
          <label className="block mb-2">比赛详情</label>
          <MyEditor initialValue={details} onChange={setDetails} />
        </div>

        <div className="flex justify-end space-x-4">
          <Button color="danger" variant="light" onClick={() => router.push(`/competition/${id}`)}>
            取消
          </Button>
          <Button type="submit" color="primary">
            更新比赛
          </Button>
        </div>
      </form>
    </div>
  )
}

export default EditCompetitionPage
