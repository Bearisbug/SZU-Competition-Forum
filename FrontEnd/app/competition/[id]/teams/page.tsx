'use client';

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@heroui/react";
import { Button } from "@heroui/react";
import toast from "react-hot-toast";
import {TeamInfo} from "@/modules/competition/competition.model";
import {fetchTeamsInfo} from "@/modules/competition/competition.api";
import LoadingPage from "@/components/LoadingPage";

// 强制动态渲染
export const dynamic = 'force-dynamic';

export default function TeamsInfoPage() {
  const params = useParams();
  const competitionId = params.id;
  const router = useRouter();

  const [teamsData, setTeamsData] = useState<TeamInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);

  const handleExportCSV = () => {
    if (teamsData.length === 0) {
      toast.error("无数据可导出！");
      return;
    }

    let csvContent = "队伍ID,队伍名称,成员姓名,成员年级,成员专业,成员邮箱\n";
    teamsData.forEach((team) => {
      if (team.members.length === 0) {
        csvContent += `${team.team_id},${team.team_name},无成员,,,,\n`;
      } else {
        team.members.forEach((member) => {
          csvContent += `${team.team_id},${team.team_name},${member.name},${member.grade},${member.major},${member.email}\n`;
        });
      }
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `competition_${competitionId}_teams.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const loadResources = async () => {
      await Promise.all([
        (async () => {
          const result = await fetchTeamsInfo(competitionId as string);

          if (result.ok) {
            setTeamsData(result.value);
          }
          else {
            toast.error("比赛队伍加载失败！");
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
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">报名队伍信息</h1>
        <div>
          <Button onPress={() => router.back()} className="mr-2">
            返回
          </Button>
          <Button onPress={handleExportCSV} isDisabled={teamsData.length === 0}>
            导出 CSV
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : teamsData.length === 0 ? (
        <p>暂无队伍报名</p>
      ) : (
        <Table aria-label="报名队伍信息">
          <TableHeader>
            <TableColumn>队伍 ID</TableColumn>
            <TableColumn>队伍名称</TableColumn>
            <TableColumn>成员姓名</TableColumn>
            <TableColumn>年级</TableColumn>
            <TableColumn>专业</TableColumn>
            <TableColumn>邮箱</TableColumn>
          </TableHeader>
          <TableBody>
            {teamsData.flatMap((team) =>
              team.members.length === 0 ? (
                <TableRow key={`team-${team.team_id}`}>
                  <TableCell>{team.team_id}</TableCell>
                  <TableCell>{team.team_name}</TableCell>
                  <TableCell>无成员</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
              ) : (
                team.members.map((member, index) => (
                  <TableRow key={`team-${team.team_id}-member-${index}`}>
                    <TableCell>{index === 0 ? team.team_id : ''}</TableCell>
                    <TableCell>{index === 0 ? team.team_name : ''}</TableCell>
                    <TableCell>{member.name}</TableCell>
                    <TableCell>{member.grade}</TableCell>
                    <TableCell>{member.major}</TableCell>
                    <TableCell>{member.email}</TableCell>
                  </TableRow>
                ))
              )
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

