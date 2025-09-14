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
  competition_level?: string;
  competition_level_key: string;
  competition_subtype?: string;
  competition_subtype_key: string;
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
 * 赛事类型数据模型
 */
export type CompetitionType = {
  key: string,
  translation: string
}

/**
 * 赛事子类型数据模型
 */
export type CompetitionSubtype = {
  key: string,
  translation: string
}

/**
 * 赛事等级数据模型
 */
export type CompetitionLevel = {
  key: string,
  translation: string,
  subtypes: CompetitionSubtype[]
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