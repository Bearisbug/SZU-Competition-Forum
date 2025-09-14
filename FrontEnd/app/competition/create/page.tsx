"use client"
import React, {useState, useEffect} from "react";
import { useRouter } from "next/navigation";
import { withAdmin } from "@/lib/auth-guards";
import { Input, Button, Select, SelectItem, DateInput } from "@heroui/react";
import { CalendarDateTime } from "@internationalized/date";
import MyEditor from "@/components/IOEditor";
import toast from "react-hot-toast";
import {Competition, CompetitionLevel, CompetitionType} from "@/modules/competition/competition.model";
import {calendarDateUTCToday, parseDate} from "@/lib/date";
import {createCompetition, fetchCompetitionLevels} from "@/modules/competition/competition.api";
import {uploadImage} from "@/modules/global/global.api";
import LoadingPage from "@/components/LoadingPage";

function CreateCompetitionPageContent() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [competitionLevelKey, setCompetitionLevelKey] = useState("");
  const [competitionSubtypeKey, setCompetitionSubtypeKey] = useState("");
  // 日期使用 CalendarDateTime
  const [signUpStartDate, setSignUpStartDate] = useState<CalendarDateTime | null>(calendarDateUTCToday());
  const [signUpEndDate, setSignUpEndDate] = useState<CalendarDateTime | null>(calendarDateUTCToday());
  const [competitionStartDate, setCompetitionStartDate] = useState<CalendarDateTime | null>(calendarDateUTCToday());
  const [competitionEndDate, setCompetitionEndDate] = useState<CalendarDateTime | null>(calendarDateUTCToday());
  const [coverImage, setCoverImage] = useState("");
  const [coverPreview, setCoverPreview] = useState("");

  const [competitionLevels, setCompetitionLevels] = useState<CompetitionLevel[]>([]);

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
      !competitionLevelKey ||
      !competitionSubtypeKey ||
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
      competition_level_key: competitionLevelKey,
      competition_subtype_key: competitionSubtypeKey,
      sign_up_start_time: parseDate(signUpStartDate).toISOString(),
      sign_up_end_time: parseDate(signUpEndDate).toISOString(),
      competition_start_time: parseDate(competitionStartDate).toISOString(),
      competition_end_time: parseDate(competitionEndDate).toISOString(),
      cover_image: coverImage,
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
    <div className="flex-1 min-h-0 container mx-auto p-4 w-3/5">
      <h1 className="text-2xl font-bold mb-4">创建新比赛</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="比赛名称" value={name} onChange={e => setName(e.target.value)} required />
        <Input label="主办方" value={organizer} onChange={e => setOrganizer(e.target.value)} required />

        {/* 移除比赛类型 */}

        <Select label="比赛等级" selectedKeys={[competitionLevelKey]} onSelectionChange={(keys) => {
          const value = Array.from(keys)[0] as string;
          setCompetitionLevelKey(value);
          setCompetitionSubtypeKey("");
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
          <Select label="比赛子类型" selectedKeys={[competitionSubtypeKey]} onSelectionChange={(keys) => {
            const value = Array.from(keys)[0] as string;
            setCompetitionSubtypeKey(value)
          }} required>
            {
              competitionLevels.find(level => (level.key == competitionLevelKey))!.subtypes.map((subtype) => {
                return (<SelectItem key={subtype.key}>{subtype.translation}</SelectItem>)
              })
            }
          </Select>
        )}

        {/* 四个 DateInput */}
        <div className="flex gap-4">
          <DateInput label="报名开始时间" value={signUpStartDate} onChange={setSignUpStartDate} granularity={"second"} isRequired/>
          <DateInput label="报名结束时间" value={signUpEndDate} onChange={setSignUpEndDate} granularity={"second"} isRequired />
        </div>
        <div className="flex gap-4">
          <DateInput label="比赛开始时间" value={competitionStartDate} onChange={setCompetitionStartDate} granularity={"second"} isRequired />
          <DateInput label="比赛结束时间" value={competitionEndDate} onChange={setCompetitionEndDate} granularity={"second"} isRequired />
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
