"use client"
import React, {useState} from "react";
import { useRouter } from "next/navigation";
import { withAdmin } from "@/lib/auth-guards";
import { Input, Button, Select, SelectItem, DateInput } from "@heroui/react";
import { CalendarDateTime } from "@internationalized/date";
import MyEditor from "@/components/IOEditor";
import toast from "react-hot-toast";
import {Competition, COMPETITION_LEVELS, UNDEFINED_COMPETITION_SUBTYPE} from "@/modules/competition/competition.model";
import {calendarDateUTCToday, truncateToDate, parseDate} from "@/lib/date";
import {createCompetition} from "@/modules/competition/competition.api";
import {uploadImage} from "@/modules/global/global.api";

function CreateCompetitionPageContent() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [competitionLevel, setCompetitionLevel] = useState("");
  const [competitionSubtype, setCompetitionSubtype] = useState("");
  // 日期使用 CalendarDateTime
  const [signUpStartDate, setSignUpStartDate] = useState<CalendarDateTime | null>(calendarDateUTCToday());
  const [signUpEndDate, setSignUpEndDate] = useState<CalendarDateTime | null>(calendarDateUTCToday());
  const [competitionStartDate, setCompetitionStartDate] = useState<CalendarDateTime | null>(calendarDateUTCToday());
  const [competitionEndDate, setCompetitionEndDate] = useState<CalendarDateTime | null>(calendarDateUTCToday());
  const [coverImage, setCoverImage] = useState("");
  const [coverPreview, setCoverPreview] = useState("");

  // 从 AuthStore 获取登录状态
  //const isLoggedIn = true; // 管理员页面必定是登录状态

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
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !name ||
      !details ||
      !organizer ||
      !competitionLevel ||
      !competitionSubtype ||
      !signUpStartDate ||
      !signUpEndDate ||
      !competitionStartDate ||
      !competitionEndDate ||
      !coverImage
    ) {
      toast.error("请填写所有必填字段！");
      return;
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
    };

    const result = await createCompetition(data)
    if (result.ok) {
      toast.success("比赛创建成功！");
      router.push("/competition");
    }
    else {
      toast.error("创建比赛失败，请重试！");
      console.log(result.value);
    }
  };

  return (
    <div className="flex-1 min-h-0 container mx-auto p-4 w-3/5">
      <h1 className="text-2xl font-bold mb-4">创建新比赛</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="比赛名称" value={name} onChange={e => setName(e.target.value)} required />
        <Input label="主办方" value={organizer} onChange={e => setOrganizer(e.target.value)} required />

        {/* 移除比赛类型 */}

        <Select label="比赛等级" selectedKeys={[competitionLevel]} onSelectionChange={(keys) => {
          const value = Array.from(keys)[0] as string;
          setCompetitionLevel(value);
          setCompetitionSubtype("");
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
          <Select label="比赛子类型" selectedKeys={[competitionSubtype]} onSelectionChange={(keys) => {
            const value = Array.from(keys)[0] as string;
            setCompetitionSubtype(value)
          }} required>
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

        {/* 四个 DateInput */}
        <div className="flex gap-4">
          <DateInput label="报名开始时间" value={signUpStartDate} onChange={setSignUpStartDate} granularity={"day"} isRequired/>
          <DateInput label="报名结束时间" value={signUpEndDate} onChange={setSignUpEndDate} granularity={"day"} isRequired />
        </div>
        <div className="flex gap-4">
          <DateInput label="比赛开始时间" value={competitionStartDate} onChange={setCompetitionStartDate} granularity={"day"} isRequired />
          <DateInput label="比赛结束时间" value={competitionEndDate} onChange={setCompetitionEndDate} granularity={"day"} isRequired />
        </div>

        <div>
          <label className="block mb-2">封面图片</label>
          {coverPreview && <img src={coverPreview} alt="封面预览" className="mb-2 w-32 h-32 object-cover border" />}
          <Input type="file" accept="image/*" onChange={handleImageUpload} />
          {coverImage && <p className="text-sm text-gray-500">上传成功的 URL: {coverImage}</p>}
        </div>

        <div>
          <label className="block mb-2">比赛详情</label>
          <MyEditor initialValue={details} onChange={setDetails} />
        </div>

        <Button type="submit" color="primary">发布比赛</Button>
      </form>
    </div>
  );
}

// 使用管理员权限校验高阶组件包装原始组件
const CreateCompetitionPage = withAdmin(CreateCompetitionPageContent);
export default CreateCompetitionPage;
