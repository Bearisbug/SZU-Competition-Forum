"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import {Input, Button, Select, SelectItem, DateInput} from "@heroui/react"
import MyEditor from "@/components/IOEditor"
import toast from "react-hot-toast"
import {parseCalendarDateTime, parseDate} from "@/lib/date";
import {Competition, CompetitionLevel, CompetitionType} from "@/modules/competition/competition.model";
import {CalendarDateTime} from "@internationalized/date";
import {
  fetchCompetition,
  fetchCompetitionLevels,
  updateCompetition
} from "@/modules/competition/competition.api";
import {uploadImage} from "@/modules/global/global.api";
import LoadingPage from "@/components/LoadingPage";

// 强制动态渲染
export const dynamic = 'force-dynamic';

function EditCompetitionPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id  // Next.js 13 App Router: dynamic param is in params object

  const [name, setName] = useState("")
  const [details, setDetails] = useState("")
  const [organizer, setOrganizer] = useState("")
  const [competitionLevelKey, setCompetitionLevelKey] = useState("");
  const [competitionSubtypeKey, setCompetitionSubtypeKey] = useState("");
  const [signUpStartTime, setSignUpStartTime] = useState<CalendarDateTime | null>(null)
  const [signUpEndTime, setSignUpEndTime] = useState<CalendarDateTime | null>(null)
  const [competitionStartTime, setCompetitionStartTime] = useState<CalendarDateTime | null>(null)
  const [competitionEndTime, setCompetitionEndTime] = useState<CalendarDateTime | null>(null)
  const [coverImage, setCoverImage] = useState("")
  const [coverPreview, setCoverPreview] = useState("")
  const [loading, setLoading] = useState(true)
  const [loadFailed, setLoadFailed] = useState(false);

  const [competitionLevels, setCompetitionLevels] = useState<CompetitionLevel[]>([]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      toast.error("请选择图片文件！");
      return;
    }

    const result = await uploadImage(file);

    if (result.ok) {
      const imageUrl = result.value;
      setCoverImage(imageUrl);
      setCoverPreview(URL.createObjectURL(file));
      toast.success("图片上传成功！");
    }
    else {
      toast.error("上传图片失败，请重试！");
      console.log(result.value);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !name ||
      !details ||
      !organizer ||
      !competitionLevelKey ||
      !competitionSubtypeKey ||
      !signUpStartTime ||
      !signUpEndTime ||
      !competitionStartTime ||
      !competitionEndTime
    ) {
      toast.error("请填写所有必填字段！")
      return
    }

    const data: Competition = {
      name,
      details,
      organizer,
      competition_level_key: competitionLevelKey,
      competition_subtype_key: competitionSubtypeKey,
      sign_up_start_time: parseDate(signUpStartTime).toISOString(),
      sign_up_end_time: parseDate(signUpEndTime).toISOString(),
      competition_start_time: parseDate(competitionStartTime).toISOString(),
      competition_end_time: parseDate(competitionEndTime).toISOString(),
      cover_image: coverImage
    }

    const result = await updateCompetition(id as string, data);
    if (result.ok) {
      toast.success("比赛更新成功！");
      router.push(`/competition/${id}`);
    }
    else {
      toast.error("更新比赛失败，请重试！");
      console.log(result.value);
    }
  }

  useEffect(() => {
    const loadResources = async () => {
      await Promise.all([
        (async () => {
          const result = await fetchCompetitionLevels();

          if (result.ok) {
            console.log(result.value);
            setCompetitionLevels(result.value);
          }
          else {
            toast.error("比赛等级加载失败！");
            console.log(result.value);
            setLoadFailed(true);
          }
        })(),
        (async () => {
          const result = await fetchCompetition(id as string);

          if (result.ok) {
            const data = result.value;

            setName(data.name)
            setDetails(data.details)
            setOrganizer(data.organizer)
            setCompetitionLevelKey(data.competition_level_key)
            setCompetitionSubtypeKey(data.competition_subtype_key)
            setSignUpStartTime(parseCalendarDateTime(new Date(data.sign_up_start_time)))
            setSignUpEndTime(parseCalendarDateTime(new Date(data.sign_up_end_time)))
            setCompetitionStartTime(parseCalendarDateTime(new Date(data.competition_start_time)))
            setCompetitionEndTime(parseCalendarDateTime(new Date(data.competition_end_time)))
            setCoverImage(data.cover_image)
            setCoverPreview(data.cover_image)

            toast.success("比赛信息加载成功！")
          }
          else {
            toast.error("比赛加载失败！");
            console.log(result.value);
            setLoadFailed(true);
          }
        })()
      ]);

      setLoading(false);
    }

    void loadResources();
  }, []);

  if (loading) {
    return (
      <LoadingPage />
    )
  }

  if (loadFailed) {
    return (
      <LoadingPage />
    )
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

        <Select
          label="比赛等级"
          selectedKeys={[competitionLevelKey]}
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0] as string;
            setCompetitionLevelKey(value);
            setCompetitionSubtypeKey("")
          }} required>
          {
            competitionLevels.map((level) => {
              return (
                <SelectItem key={level.key}>{level.translation}</SelectItem>
              );
            })
          }
        </Select>

        {competitionLevelKey && (
          <Select
            label="比赛子类型"
            selectedKeys={[competitionSubtypeKey]}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0] as string;
              setCompetitionSubtypeKey(value)
            }}
            required>
            {
              competitionLevels.find(level => (level.key == competitionLevelKey))!.subtypes.map((subtype) => {
                return (<SelectItem key={subtype.key}>{subtype.translation}</SelectItem>)
              })
            }
          </Select>
        )}

        <DateInput
          label="报名开始时间"
          value={signUpStartTime}
          onChange={setSignUpStartTime}
          granularity={"second"}
          isRequired
        />

        <DateInput
          label="报名结束时间"
          value={signUpEndTime}
          onChange={setSignUpEndTime}
          granularity={"second"}
          isRequired
        />

        <DateInput
          label="比赛开始时间"
          value={competitionStartTime}
          onChange={setCompetitionStartTime}
          granularity={"second"}
          isRequired
        />

        <DateInput
          label="比赛结束时间"
          value={competitionEndTime}
          onChange={setCompetitionEndTime}
          granularity={"second"}
          isRequired
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
          <Button color="danger" variant="light" onPress={() => router.push(`/competition/${id}`)}>
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
