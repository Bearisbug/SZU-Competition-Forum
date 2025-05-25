"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input, Button, Select, SelectItem } from "@heroui/react"
import MyEditor from "@/components/IOEditor"  // 你自行实现的富文本编辑组件
import toast from "react-hot-toast"

/**
 * 比赛的数据结构，跟后端对应
 */
export type Competition = {
  id: number
  name: string
  sign_up_start_time: string
  sign_up_end_time: string
  competition_start_time: string
  competition_end_time: string
  details: string
  organizer: string
  competition_type: string
  cover_image: string
  created_at: string
  updated_at: string
}

function CreateCompetitionPage() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [details, setDetails] = useState("")
  const [organizer, setOrganizer] = useState("")
  const [competitionType, setCompetitionType] = useState("")
  const [signUpStartTime, setSignUpStartTime] = useState("")
  const [signUpEndTime, setSignUpEndTime] = useState("")
  const [competitionStartTime, setCompetitionStartTime] = useState("")
  const [competitionEndTime, setCompetitionEndTime] = useState("")
  const [coverImage, setCoverImage] = useState("")
  const [coverPreview, setCoverPreview] = useState("")

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      toast.error("请选择图片文件！")
      return
    }

    const formData = new FormData()
    formData.append("image", file)

    try {
      const response = await fetch("http://127.0.0.1:8000/upload_image", {
        method: "POST",
        headers: {
          // 如果上传也需要鉴权，请在这里添加
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
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

    // 简单校验
    if (
      !name ||
      !details ||
      !organizer ||
      !competitionType ||
      !signUpStartTime ||
      !signUpEndTime ||
      !competitionStartTime ||
      !competitionEndTime ||
      !coverImage
    ) {
      toast.error("请填写所有必填字段！")
      return
    }

    try {
      // 构造请求体
      const bodyData = {
        name,
        details,
        organizer,
        competition_type: competitionType,
        sign_up_start_time: signUpStartTime,
        sign_up_end_time: signUpEndTime,
        competition_start_time: competitionStartTime,
        competition_end_time: competitionEndTime,
        cover_image: coverImage,
      }

      const response = await fetch("http://127.0.0.1:8000/api/competitions/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify(bodyData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "创建比赛失败！")
      }

      toast.success("比赛创建成功！")
      router.push("/competition")
    } catch (error) {
      console.error("创建比赛错误:", error)
      toast.error("创建比赛失败，请重试！")
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">创建新比赛</h1>
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

        <Select
          label="比赛类型"
          value={competitionType}
          onChange={(e) => setCompetitionType(e.target.value)}
          required
        >
          <SelectItem key="hackathon">黑客马拉松</SelectItem>
          <SelectItem key="datascience">数据科学</SelectItem>
          <SelectItem key="ai" >人工智能</SelectItem>
          <SelectItem key="programming">编程竞赛</SelectItem>
        </Select>

        <Input
          label="报名开始时间"
          type="datetime-local"
          value={signUpStartTime}
          onChange={(e) => setSignUpStartTime(e.target.value)}
          required
        />

        <Input
          label="报名结束时间"
          type="datetime-local"
          value={signUpEndTime}
          onChange={(e) => setSignUpEndTime(e.target.value)}
          required
        />

        <Input
          label="比赛开始时间"
          type="datetime-local"
          value={competitionStartTime}
          onChange={(e) => setCompetitionStartTime(e.target.value)}
          required
        />

        <Input
          label="比赛结束时间"
          type="datetime-local"
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

        <Button type="submit" color="primary">
          发布比赛
        </Button>
      </form>
    </div>
  )
}

export default CreateCompetitionPage
