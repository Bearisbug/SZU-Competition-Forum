"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { withAdmin } from "@/lib/auth-guards";
import { Input, Button, Select, SelectItem, DateInput } from "@heroui/react";
import { CalendarDate } from "@internationalized/date";
import MyEditor from "@/components/IOEditor"; // 你自行实现的富文本编辑组件
import toast from "react-hot-toast";
import { API_BASE_URL } from "@/CONFIG";

/**
 * 比赛的数据结构，跟后端对应
 */
export type Competition = {
  id: number;
  name: string;
  sign_up_start_time: string;
  sign_up_end_time: string;
  competition_start_time: string;
  competition_end_time: string;
  details: string;
  organizer: string;
  competition_level: string;
  competition_subtype: string;
  cover_image: string;
  created_at: string;
  updated_at: string;
};

function CreateCompetitionPageContent() {
  const router = useRouter();

  // 默认今天
  const today = new CalendarDate(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    new Date().getDate()
  );

  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [competitionLevel, setCompetitionLevel] = useState("");
  const [competitionSubtype, setCompetitionSubtype] = useState("");
  // 日期使用 CalendarDate
  const [signUpStartDate, setSignUpStartDate] = useState<CalendarDate | null>(today);
  const [signUpEndDate, setSignUpEndDate] = useState<CalendarDate | null>(today);
  const [competitionStartDate, setCompetitionStartDate] = useState<CalendarDate | null>(today);
  const [competitionEndDate, setCompetitionEndDate] = useState<CalendarDate | null>(today);
  const [coverImage, setCoverImage] = useState("");
  const [coverPreview, setCoverPreview] = useState("");

  const subtypeOptions: { [key: string]: { key: string; label: string }[] } = {
    "Ⅰ类": [
      { key: "中国互联网+大学生创新创业大赛", label: "中国互联网+大学生创新创业大赛" },
      { key: "挑战杯课外学术科技作品竞赛", label: "挑战杯课外学术科技作品竞赛" },
      { key: "挑战杯大学生创业计划竞赛", label: "挑战杯大学生创业计划竞赛" },
    ],
    "Ⅱ类": [
      { key: "A类", label: "A类" },
      { key: "B类", label: "B类" },
      { key: "C类", label: "C类" },
    ],
    "Ⅲ类": [
      { key: "无分类", label: "无分类" }
    ]
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      toast.error("请选择图片文件！");
      return;
    }
    const formData = new FormData();
    formData.append("image", file);
    try {
      const response = await fetch(`${API_BASE_URL}/upload_image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem("access_token") : ''}` },
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "上传图片失败！");
      }
      const result = await response.json();
      setCoverImage(result.data.url);
      setCoverPreview(URL.createObjectURL(file));
      toast.success("图片上传成功！");
    } catch (error) {
      console.error(error);
      toast.error("上传图片失败，请重试！");
    }
  };

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
    try {
      const bodyData = {
        name,
        details,
        organizer,
        competition_level: competitionLevel,
        competition_subtype: competitionSubtype,
        sign_up_start_time: signUpStartDate.toString(),
        sign_up_end_time: signUpEndDate.toString(),
        competition_start_time: competitionStartDate.toString(),
        competition_end_time: competitionEndDate.toString(),
        cover_image: coverImage,
      };
      const response = await fetch(`${API_BASE_URL}/api/competitions/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem("access_token") : ''}`,
        },
        body: JSON.stringify(bodyData),
      });
      if (!response.ok) throw new Error((await response.json()).detail || "创建比赛失败！");
      toast.success("比赛创建成功！");
      router.push("/competition");
    } catch (error) {
      console.error(error);
      toast.error("创建比赛失败，请重试！");
    }
  };

  const [mounted, setMounted] = useState(false);
  
  // 从 AuthStore 获取登录状态
  const isLoggedIn = true; // 管理员页面必定是登录状态
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  return (
    <div className="flex-1 min-h-0 container mx-auto p-4 w-3/5">
      <h1 className="text-2xl font-bold mb-4">创建新比赛</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="比赛名称" value={name} onChange={e => setName(e.target.value)} required />
        <Input label="主办方" value={organizer} onChange={e => setOrganizer(e.target.value)} required />

        {/* 移除比赛类型 */}

        <Select label="比赛等级" value={competitionLevel} onChange={e => { setCompetitionLevel(e.target.value); setCompetitionSubtype("") }} required>
          <SelectItem key="Ⅰ类">Ⅰ类</SelectItem>
          <SelectItem key="Ⅱ类">Ⅱ类</SelectItem>
          <SelectItem key="Ⅲ类">Ⅲ类</SelectItem>
        </Select>

        {competitionLevel && (
          <Select label="比赛子类型" value={competitionSubtype} onChange={e => setCompetitionSubtype(e.target.value)} required>
            {subtypeOptions[competitionLevel].map(item => <SelectItem key={item.key}>{item.label}</SelectItem>)}
          </Select>
        )}

        {/* 四个 DateInput */}
        <div className="flex gap-4">
          <DateInput label="报名开始时间" value={signUpStartDate} onChange={setSignUpStartDate} isRequired />
          <DateInput label="报名结束时间" value={signUpEndDate} onChange={setSignUpEndDate} isRequired />
        </div>
        <div className="flex gap-4">
          <DateInput label="比赛开始时间" value={competitionStartDate} onChange={setCompetitionStartDate} isRequired />
          <DateInput label="比赛结束时间" value={competitionEndDate} onChange={setCompetitionEndDate} isRequired />
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
