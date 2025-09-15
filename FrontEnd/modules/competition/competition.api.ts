import {API_BASE_URL} from "@/CONFIG";
import {
  Competition,
  CompetitionAnnouncement,
  TeamInfo
} from "@/modules/competition/competition.model";
import {Result} from "@/lib/result";
import {throwError} from "@/lib/utils";

/**
 * 获取特定赛事信息
 * @param id 赛事ID
 */
export async function fetchCompetition(id: string): Promise<Result<Competition, Error>> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/competitions/detail/${id}`,
      {
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem("access_token") : ''}`,
        },
      }
    );
    if (response.ok) {
      return {
        ok: true,
        value: await response.json()
      };
    }
    else {
      throwError("获取比赛详情失败");
    }
  }
  catch (error) {
    return {
      ok: false,
      value: error as Error
    };
  }
}

/**
 * 获取所有赛事信息
 */
export async function fetchCompetitions(): Promise<Result<Competition[], Error>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/competitions/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
      },
    });

    if (response.ok) {
      return {
        ok: true,
        value: await response.json()
      };
    }
    else {
      throwError("无法加载竞赛信息！");
    }

  } catch (error) {
    return {
      ok: false,
      value: error as Error
    };
  }
}

/**
 * 创建赛事
 * @param competition 赛事数据模型
 */
export async function createCompetition(competition: Competition): Promise<Result<true, Error>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/competitions/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem("access_token") : ''}`,
      },
      body: JSON.stringify(competition),
    });

    if (response.ok){
      return {
        ok: true,
        value: true
      };
    }
    else {
      throwError((await response.json()).detail || "创建比赛失败！");
    }
  }
  catch (error) {
    return {
      ok: false,
      value: error as Error
    };
  }
}

/**
 * 更新赛事
 * @param id 赛事ID
 * @param competition 赛事数据模型
 */
export async function updateCompetition(id: string, competition: Competition): Promise<Result<true, Error>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/competitions/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem("access_token") : ''}`,
      },
      body: JSON.stringify(competition),
    })

    if (response.ok) {
      return {
        ok: true,
        value: true
      };
    }
    else {
      const errorData = await response.json()
      throwError(errorData.detail || "更新比赛失败！")
    }
  }
  catch (error) {
    return {
      ok: false,
      value: error as Error
    };
  }
}

/**
 * 删除赛事
 * @param id 赛事ID
 * @param token 交互token
 */
export async function deleteCompetition(id: number, token: string): Promise<Result<true, Error>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/competitions/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      return {
        ok: true,
        value: true
      };
    }
    else {
      const err = await response.json().catch(() => ({}));
      throwError(err?.detail || "删除失败");
    }
  } catch (error) {
    return {
      ok: false,
      value: error as Error
    };
  }
}

/**
 * 发布特定赛事公告
 * @param id 赛事ID
 * @param newAnnouncementTitle 公告标题
 * @param newAnnouncementContent 公告内容
 */
export async function publishAnnouncement(id: string, newAnnouncementTitle: string, newAnnouncementContent: string)
  : Promise<Result<CompetitionAnnouncement, Error>>
{
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/competitions/detail/${id}/announcements`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem("access_token") : ''}`,
        },
        body: JSON.stringify({
          title: newAnnouncementTitle,
          content: newAnnouncementContent,
        }),
      }
    );

    if (response.ok) {
      return {
        ok: true,
        value: await response.json()
      };
    }
    else {
      const errData = await response.json();
      throwError(errData.detail || "公告发布失败");
    }
  }
  catch (error) {
    return {
      ok: false,
      value: error as Error
    };
  }
}

/**
 * 删除赛事公告
 * @param id 赛事ID
 * @param announcementId 公告ID
 */
export async function deleteAnnouncement(id: string, announcementId: number): Promise<Result<true, Error>> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/competitions/detail/${id}/announcements/${announcementId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem("access_token") : ''}`,
        },
      }
    );

    if (response.ok) {
      return {
        ok: true,
        value: true
      };

    }
    else {
      const errorData = await response.json();
      throwError(errorData.detail || "公告删除失败");
    }

  }
  catch (error) {
    return {
      ok: false,
      value: error as Error
    };
  }
}

/**
 * 获取赛事所有队伍信息
 * @param id 赛事ID
 */
export async function fetchTeamsInfo(id: string): Promise<Result<TeamInfo[], Error>> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/competitions/${id}/registrations/teams-info`,
      {
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem("access_token") : ''}`,
        },
      }
    );

    if (response.ok) {
      return {
        ok: true,
        value: await response.json()
      };

    }
    else {
      const errorData = await response.json();
      throwError(errorData.detail || "无法获取队伍信息");
    }
  } catch (error) {
    return {
      ok: false,
      value: error as Error
    };
  }
}

/**
 * 队伍报名参赛
 * @param id 赛事ID
 * @param teamId 队伍ID
 */
export async function teamSelectCompetition(id: string, teamId: number): Promise<Result<true, Error>> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/competitions/${id}/register/${teamId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem("access_token") : ''}`,
        },
      }
    );

    if (response.ok) {
      return {
        ok: true,
        value: true
      };
    }
    else {
      const errorData = await response.json();
      throwError(errorData.detail || "报名失败");
    }
  } catch (error) {
    return {
      ok: false,
      value: error as Error
    };
  }
}