"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import {Input, Button, Select, SelectItem, DateInput} from "@heroui/react"
import MyEditor from "@/components/IOEditor"
import toast from "react-hot-toast"
import {truncateToDate, parseCalendarDateTime, parseDate} from "@/lib/date";
import {Competition, COMPETITION_LEVELS, UNDEFINED_COMPETITION_SUBTYPE} from "@/modules/competition/competition.model";
import {CalendarDateTime} from "@internationalized/date";
import {
  fetchCompetition,
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
  const [competitionLevel, setCompetitionLevel] = useState("");
  const [competitionSubtype, setCompetitionSubtype] = useState("");
  const [signUpStartDate, setSignUpStartDate] = useState<CalendarDateTime | null>(null)
  const [signUpEndDate, setSignUpEndDate] = useState<CalendarDateTime | null>(null)
  const [competitionStartDate, setCompetitionStartDate] = useState<CalendarDateTime | null>(null)
  const [competitionEndDate, setCompetitionEndDate] = useState<CalendarDateTime | null>(null)
  const [coverImage, setCoverImage] = useState("")
  const [coverPreview, setCoverPreview] = useState("")
  const [loading, setLoading] = useState(true)
  const [loadFailed, setLoadFailed] = useState(false);

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
      !competitionLevel ||
      !competitionSubtype ||
      !signUpStartDate ||
      !signUpEndDate ||
      !competitionStartDate ||
      !competitionEndDate
    ) {
      toast.error("请填写所有必填字段！")
      return
    }

    const data: Competition = {
      name,
      details,
      organizer,
      competition_level: competitionLevel,
      competition_subtype: (competitionSubtype === UNDEFINED_COMPETITION_SUBTYPE) ? null : competitionSubtype,
      sign_up_start_time: parseDate(truncateToDate(signUpStartDate)).toISOString(),
      sign_up_end_time: parseDate(truncateToDate(signUpEndDate)).toISOString(),
      competition_start_time: parseDate(truncateToDate(competitionStartDate)).toISOString(),
      competition_end_time: parseDate(truncateToDate(competitionEndDate)).toISOString(),
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
          const result = await fetchCompetition(id as string);

          if (result.ok) {
            const data = result.value;

            setName(data.name)
            setDetails(data.details)
            setOrganizer(data.organizer)
            setCompetitionLevel(data.competition_level)
            setCompetitionSubtype(data.competition_subtype || UNDEFINED_COMPETITION_SUBTYPE)
            setSignUpStartDate(parseCalendarDateTime(new Date(data.sign_up_start_time)))
            setSignUpEndDate(parseCalendarDateTime(new Date(data.sign_up_end_time)))
            setCompetitionStartDate(parseCalendarDateTime(new Date(data.competition_start_time)))
            setCompetitionEndDate(parseCalendarDateTime(new Date(data.competition_end_time)))
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
          selectedKeys={[competitionLevel]}
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0] as string;
            setCompetitionLevel(value);
            setCompetitionSubtype("")
          }} required>
          {
            COMPETITION_LEVELS.map((level) => {
              return (
                <SelectItem key={level.value}>{level.value}</SelectItem>
              );
            })
          }
        </Select>

        {competitionLevel && (
          <Select
            label="比赛子类型"
            selectedKeys={[competitionSubtype]}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0] as string;
              setCompetitionSubtype(value)
            }}
            required>
            {(() => {
              const subtypes = COMPETITION_LEVELS.find(level => (level.value == competitionLevel))!.subtypes;

              return (subtypes) ?
                subtypes.map((subtype) => {
                  return (<SelectItem key={subtype.value}>{subtype.value}</SelectItem>)
                }) :
                [(<SelectItem key={UNDEFINED_COMPETITION_SUBTYPE}>{UNDEFINED_COMPETITION_SUBTYPE}</SelectItem>)]
            })()}
          </Select>
        )}

        <DateInput
          label="报名开始时间"
          value={signUpStartDate}
          onChange={setSignUpStartDate}
          granularity={"day"}
          isRequired
        />

        <DateInput
          label="报名结束时间"
          value={signUpEndDate}
          onChange={setSignUpEndDate}
          granularity={"day"}
          isRequired
        />

        <DateInput
          label="比赛开始时间"
          value={competitionStartDate}
          onChange={setCompetitionStartDate}
          granularity={"day"}
          isRequired
        />

        <DateInput
          label="比赛结束时间"
          value={competitionEndDate}
          onChange={setCompetitionEndDate}
          granularity={"day"}
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
