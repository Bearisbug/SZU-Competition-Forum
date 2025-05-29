"use client";

import React, { useState, useEffect, useCallback } from "react";
import { TeamCard } from "@/components/Card/TeamCard";
import { FilterSidebar } from "@/components/FilterSidebar";
import { Pagination, Spinner, Button } from "@heroui/react";
import { CreateTeamModal } from "@/components/Modal/CreateTeamModal";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import { API_BASE_URL } from "@/CONFIG";

type Team = {
  id: number;
  name: string;
  description: string;
  goals: string;
  requirements: string[];
  max_members: number;
};

type TeamMember = {
  id: number;
  team_id: number;
  user_id: number;
  name: string;
  role: string;
  position: string;
  major: string;
  avatarUrl: string | null;
  status: number;
};

type FilterCategory = "goals" | "requirements" | "roles";
type FilterOption = { category: FilterCategory; label: string; value: string };
const filterCategories = [
  {
    title: "目标", // 原 "Goals"
    category: "goals" as FilterCategory,
    options: [
      { label: "创新", value: "innovation" }, // 原 "Innovation"
      { label: "研究", value: "research" },   // 原 "Research"
      { label: "开发", value: "development" }, // 原 "Development"
    ],
  },
  {
    title: "要求", // 原 "Requirements"
    category: "requirements" as FilterCategory,
    options: [
      { label: "编程", value: "programming" }, // 原 "Programming"
      { label: "设计", value: "design" },      // 原 "Design"
      { label: "管理", value: "management" },  // 原 "Management"
      { label: "营销", value: "marketing" },   // 原 "Marketing"
    ],
  },
  {
    title: "角色", // 原 "Roles"
    category: "roles" as FilterCategory,
    options: [
      { label: "开发者", value: "developer" },          // 原 "Developer"
      { label: "设计师", value: "designer" },           // 原 "Designer"
      { label: "项目经理", value: "project-manager" },   // 原 "Project Manager"
      { label: "营销专家", value: "marketing-specialist" }, // 原 "Marketing Specialist"
    ],
  },
];

export default function TeamCardPreview() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamMembers, setTeamMembers] = useState<{ [key: number]: TeamMember[] }>(
    {}
  ); // 使用 team_id 分组成员
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [filters, setFilters] = useState<FilterOption[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const teamsPerPage = 4;

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/teams/all/details`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      const data = await response.json();

      const teamsData: Team[] = data.map((item: any) => ({
        ...item.team,
        requirements: item.team.requirements.flatMap((req: string) =>
          req.split("\n")
        ),
      }));

      const membersData: { [key: number]: TeamMember[] } = data.reduce(
        (acc: any, item: any) => {
          acc[item.team.id] = item.members;
          return acc;
        },
        {}
      );

      setTeams(teamsData);
      setTeamMembers(membersData);
      setFilteredTeams(teamsData);
    } catch (error) {
      console.error("Failed to fetch team data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilterChange = useCallback(
    (newFilters: FilterOption[]) => {
      setFilters(newFilters);
      setCurrentPage(1);

      let filtered = teams;

      if (newFilters.length > 0) {
        filtered = filtered.filter((team) =>
          newFilters.every((filter) => {
            switch (filter.category) {
              case "goals":
                return team.goals.includes(filter.label);
              case "requirements":
                return team.requirements.includes(filter.label);
              case "roles":
                return teamMembers[team.id]?.some(
                  (member) => member.role === filter.label
                );
              default:
                return true;
            }
          })
        );
      }

      setFilteredTeams(filtered);
    },
    [teams, teamMembers]
  );

  const handleCreateTeam = async (teamData: {
    name: string;
    description: string;
    goals: string;
    requirements: string[];
    maxMembers: number;
  }) => {
    try {
      const newTeam = {
        ...teamData,
        requirements: teamData.requirements.join("\n"),
      };
      const response = await fetch(`${API_BASE_URL}/api/teams`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify(newTeam),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "创建队伍失败");
      }

      const createdTeam = await response.json();
      createdTeam.requirements = createdTeam.requirements.split("\n");

      setTeams((prevTeams) => [...prevTeams, createdTeam]);
      setFilteredTeams((prevFilteredTeams) => [
        ...prevFilteredTeams,
        createdTeam,
      ]);
      toast.success(`队伍 "${createdTeam.name}" 创建成功！`);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleJoinTeam = async (teamId: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/teams/${teamId}/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to join team");
      }
      toast.success("申请已提交，请等待队长审核。");
      fetchData();
    } catch (err) {
      toast.error("申请加入失败");
    }
  };

  const handleLeaveTeam = async (teamId: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/teams/${teamId}/leave`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to leave team");
      }
      toast.success("已退出队伍。");
      fetchData();
    } catch (err) {
      toast.error("退出队伍失败");
    }
  };


  // 更新队伍（修改队伍信息/踢人）
  const handleUpdateTeam = async (teamId: number, data: Partial<Team>) => {
    try {
      // 后端只需要 { name, description, goals, requirements, remove_member_id? }
      // 这里要注意 requirements 已经是数组，因此需要把它拼成字符串(逗号分隔或换行分隔),
      // 后端以什么形式存就以什么形式传
      const payload = {
        name: data.name,
        description: data.description,
        goals: data.goals,
        requirements: data.requirements
          ? data.requirements.join(",")
          : undefined,
      };
      const res = await fetch(`${API_BASE_URL}/api/teams/${teamId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },

        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to update team");
      }
      toast.success("队伍信息已更新");
      fetchData();
    } catch (err) {
      throw err;
    }
  };

  // 解散队伍
  const handleDisbandTeam = async (teamId: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/teams/${teamId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to disband team");
      }
      toast.success("队伍已解散。");
      fetchData();
    } catch (err) {
      throw err;
    }
  };

  const handleRemoveMember = async (teamId:number,memberId: number) => {
    try {
      const payload = { remove_member_id: memberId };
      const res = await fetch(`${API_BASE_URL}/api/teams/${teamId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to remove member");
      }
      fetchData(); // 刷新队伍列表
    } catch (error) {
      console.error("Error:", error); // 打印错误信息
    }
  };
  const indexOfLastTeam = currentPage * teamsPerPage;
  const indexOfFirstTeam = indexOfLastTeam - teamsPerPage;
  const currentTeams = filteredTeams.slice(indexOfFirstTeam, indexOfLastTeam);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen gap-4">
        <Spinner size="lg" color="primary" />
        <p>加载中...</p>
      </div>
    );
  }

  if (filteredTeams.length === 0) {
    return (
      <div className="container mx-auto p-4 flex mt-16">
        <FilterSidebar
          onFilterChange={handleFilterChange}
          filterCategories={filterCategories}
        />
        <div className="flex-1 ml-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">队伍列表</h1>
            <Button color="primary" onPress={() => setIsCreateModalOpen(true)}>
              创建队伍
            </Button>
          </div>
          <div className="flex flex-col items-center justify-center h-64">
            <X className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-center text-gray-500">没有符合条件的队伍，请调整筛选条件或创建新队伍。</p>
          </div>
        </div>
        <CreateTeamModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreateTeam={handleCreateTeam}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 flex mt-16">
      <FilterSidebar
        onFilterChange={handleFilterChange}
        filterCategories={filterCategories}
      />
      <div className="flex-1 ml-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">队伍列表</h1>
          <Button color="primary" onPress={() => setIsCreateModalOpen(true)}>
            创建队伍
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentTeams.map((team) => (
            <TeamCard
              key={team.id}
              //@ts-ignore
              team={team}
              members={teamMembers[team.id] || []} // 仅传递对应队伍的成员
              onJoinTeam={handleJoinTeam}
              onLeaveTeam={handleLeaveTeam}
            onUpdateTeam={handleUpdateTeam}
              onDisbandTeam={handleDisbandTeam}
              onRemoveMember={handleRemoveMember}
            />
          ))}
        </div>
        {filteredTeams.length > teamsPerPage && (
          <div className="mt-6 flex justify-center">
            <Pagination
              total={Math.ceil(filteredTeams.length / teamsPerPage)}
              initialPage={1}
              page={currentPage}
              onChange={setCurrentPage}
            />
          </div>
        )}
      </div>
      <CreateTeamModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateTeam={handleCreateTeam}
      />
    </div>
  );
}
