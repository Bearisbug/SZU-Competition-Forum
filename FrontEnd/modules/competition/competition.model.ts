import {FilterCategory} from "@/modules/global/global.model";
import {getCompetitionFilterCategories} from "@/modules/competition/competition.service";

/**
 * 比赛专用筛选类型
 */
export type CompetitionFilterCategoryKey = "competition_level";

/**
 * 比赛等级常量
 */
export const COMPETITION_LEVELS: CompetitionLevel[] = [
  {
    value: "I 类竞赛",
    subtypes: [
      {
        value: "中国\"互联网+\"大学生创新创业大赛"
      },
      {
        value: "\"挑战杯\"课外学术科技作品竞赛"
      },
      {
        value: "\"挑战杯\"大学生创业计划竞赛"
      }
    ]
  },
  {
    value: "II 类竞赛",
    subtypes: [
      {
        value: "(A) 类"
      },
      {
        value: "(B) 类"
      },
      {
        value: "(C) 类"
      }
    ]
  },
  {
    value: "III 类竞赛"
  }
]

/**
 * 根据前端所存储的比赛等级常量所生成的筛选字样
 */
export const COMPETITION_FILTER_CATEGORIES: FilterCategory<CompetitionFilterCategoryKey>[] = getCompetitionFilterCategories(COMPETITION_LEVELS);

/**
 * 等级无子类型下的常量值
 */
export const UNDEFINED_COMPETITION_SUBTYPE = "未分类";

/**
 * 赛事数据模型
 */
export type Competition = {
  id?: number;
  name: string;
  sign_up_start_time: string;
  sign_up_end_time: string;
  competition_start_time: string;
  competition_end_time: string;
  details: string;
  organizer: string;
  competition_level: string;
  competition_subtype: string | null;
  cover_image: string;
  created_at?: string;
  updated_at?: string;
  announcements?: CompetitionAnnouncement[];
};

/**
 * 赛事公告数据模型
 */
export type CompetitionAnnouncement = {
  id: number;
  competition_id: number;
  title: string;
  content: string;
  published_at: string;
};

/**
 * 赛事子类型数据模型
 */
export type CompetitionSubtype = {
  value: string,
}

/**
 * 赛事等级数据模型
 */
export type CompetitionLevel = {
  value: string,
  subtypes?: CompetitionSubtype[]
}

/**
 * 成员信息数据模型
 */
export interface MemberInfo {
  name: string;
  grade: string;
  major: string;
  email: string;
}

/**
 * 队伍信息数据模型
 */
export interface TeamInfo {
  team_id: number;
  team_name: string;
  members: MemberInfo[];
}