"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Divider,
  Avatar,
  Tooltip,
  Link,
} from "@heroui/react";
import { Text, User, Users, Target, FileText, MoreVertical, CircleX, UserRoundPlus, DoorOpen, SquarePen } from 'lucide-react';
import toast from 'react-hot-toast';
import { JoinTeamModal } from "../Modal/JoinTeamModal";
import { EditTeamModal } from "../Modal/EditTeamModal";

// 类型定义
export type Team = {
  members: TeamMember[];
  id: number;
  name: string;
  description: string;
  goals: string;
  requirements: string[];
  max_members: number;
};

export type TeamMember = {
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

interface TeamCardProps {
  team: Team;
  members: TeamMember[];
  onJoinTeam: (teamId: number, reason: string) => Promise<void>;
  onLeaveTeam: (teamId: number) => Promise<void>;
  onUpdateTeam: (teamId: number, data: Partial<Team>) => Promise<void>;
  onDisbandTeam: (teamId: number) => Promise<void>;
  onRemoveMember: (teamId: number, memberId: number) => Promise<void>;
}

export function TeamCard({
  team,
  members,
  onJoinTeam,
  onLeaveTeam,
  onUpdateTeam,
  onDisbandTeam,
  onRemoveMember,
}: TeamCardProps) {
  const [startIndex, setStartIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // 假设我们在 localStorage 中存储了用户id
  const userId = typeof window !== "undefined" ? localStorage.getItem("id") : null;
  const currentUser = members.find(member => member.user_id.toString() === userId);
  const isLeader = currentUser?.role === "队长";
  const isMember = !!currentUser;

  useEffect(() => {
    // 用来控制卡片出现的动画
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handlePrev = () => {
    if (isAnimating || startIndex === 0) return;
    setIsAnimating(true);
    setStartIndex((prevIndex) => prevIndex - 1);
  };

  const handleNext = () => {
    if (isAnimating || startIndex >= members.length - 3) return;
    setIsAnimating(true);
    setStartIndex((prevIndex) => prevIndex + 1);
  };

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  const handleJoinTeam = async (reason: string) => {
    try {
      await onJoinTeam(team.id, reason);
      setShowJoinModal(false);
    } catch (error: any) {
      toast.error(error.message || "加入队伍失败，请重试。");
    }
  };

  const handleLeaveTeam = async () => {
    try {
      await onLeaveTeam(team.id);
    } catch (error: any) {
      toast.error(error.message || "退出队伍失败，请重试。");
    }
  };

  const handleUpdateTeam = async (data: Partial<Team>) => {
    try {
      await onUpdateTeam(team.id, data);
      setShowEditModal(false);
    } catch (error: any) {
      toast.error(error.message || "更新队伍信息失败，请重试。");
    }
  };

  const handleDisbandTeam = async () => {
    if (window.confirm("确定要解散队伍吗？")) {
      try {
        await onDisbandTeam(team.id);
      } catch (error: any) {
        toast.error(error.message || "解散队伍失败，请重试。");
      }
    }
  };

  return (
    <Card
      className={`w-full transition-all duration-500 ease-in-out hover:-translate-y-1 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <CardHeader className="flex justify-between items-center p-4">
        <h2 className="text-lg font-semibold">{team.name}</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {members.length}/{team.max_members}
          </span>
          <Users className="w-4 h-4 text-gray-500" />
          {isLeader ? (
            <div className="flex gap-2">
              <Tooltip content="编辑队伍">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onPress={() => setShowEditModal(true)}
                >
                  <SquarePen className="w-4 h-4" />
                </Button>
              </Tooltip>
              <Tooltip content="解散队伍">
                <Button
                  isIconOnly
                  size="sm"
                  color="danger"
                  variant="light"
                  onPress={handleDisbandTeam}
                >
                  <CircleX className="w-4 h-4" />
                </Button>
              </Tooltip>
            </div>
          ) : isMember ? (
            <Tooltip content="退出队伍">
              <Button
                isIconOnly
                size="sm"
                color="danger"
                variant="light"
                onPress={handleLeaveTeam}
              >
                <DoorOpen className="w-4 h-4" />
              </Button>
            </Tooltip>
          ) : (
            <Tooltip content="申请加入队伍">
              <Button
                isIconOnly
                size="sm"
                color="primary"
                variant="light"
                onPress={() => setShowJoinModal(true)}
              >
                <UserRoundPlus className="w-4 h-4" />
              </Button>
            </Tooltip>
          )}
        </div>
      </CardHeader>
      <CardBody className="p-4">
        <div className="flex justify-between items-center mb-4">
          <Button
            isIconOnly
            aria-label="上一位成员"
            variant="light"
            onPress={handlePrev}
            isDisabled={isAnimating || startIndex === 0}
          >
            {"<"}
          </Button>
          <div className="flex-1 overflow-hidden relative h-40">
            {members.slice(startIndex, startIndex + 3).map((member, index) => (
              <div
                key={member.id}
                className="absolute top-0 w-1/3 flex flex-col items-center gap-2 transition-all duration-500 ease-in-out"
                style={{
                  left: `${index * 33.33}%`,
                  opacity: 1,
                  transform: `translateX(0)`,
                }}
              >
                <Avatar
                  src={member.avatarUrl || undefined}
                  name={member.name}
                  className="w-16 h-16"
                />
                <div className="text-center">
                  <Link href={`/user/${member.user_id}`} color="foreground">
                  <p className="font-medium text-sm">{member.name}</p>
                  </Link>
                  <p className="text-xs text-gray-500">{member.role}</p>
                  <p className="text-xs text-gray-500">{member.position}</p>
                  <p className="text-xs text-gray-500">{member.major}</p>
                </div>
              </div>
            ))}
          </div>
          <Button
            isIconOnly
            aria-label="下一位成员"
            variant="light"
            onPress={handleNext}
            isDisabled={isAnimating || startIndex >= members.length - 3}
          >
            {">"}
          </Button>
        </div>
        <Divider />
        <div className="mt-4 space-y-4">
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Target className="w-4 h-4" />
              目标
            </h3>
            <p className="text-sm text-gray-600">{team.goals}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              需求
            </h3>
            <ul className="list-disc list-inside text-sm text-gray-600">
              {team.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Text className="w-4 h-4" />
              队伍简介
            </h3>
            <p className="text-sm text-gray-600">{team.description}</p>
          </div>
        </div>
      </CardBody>
      <JoinTeamModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        onJoin={handleJoinTeam}
      />
      <EditTeamModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        team={team}
        members={members}
        onUpdateTeam={handleUpdateTeam}
        onRemoveMember={onRemoveMember}
      />
    </Card>
  );
}