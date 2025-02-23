"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Avatar,
  Tooltip,
} from "@nextui-org/react";
import toast from "react-hot-toast";
import { Team, TeamMember } from "../Card/TeamCard";
import { TrashIcon } from "lucide-react";

interface EditTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: Team;
  members: TeamMember[];
  onUpdateTeam: (data: Partial<Team>) => void;
  onRemoveMember: (teamId: number, memberId: number) => Promise<void>;
}

export function EditTeamModal({
  isOpen,
  onClose,
  team,
  members,
  onUpdateTeam,
  onRemoveMember,
}: EditTeamModalProps) {
  const [name, setName] = useState(team.name);
  const [description, setDescription] = useState(team.description);
  const [goals, setGoals] = useState(team.goals);
  // 把字符串数组转成多行文本
  const [requirements, setRequirements] = useState(
    team.requirements.join("\n")
  );

  const handleSubmit = () => {
    // 将多行文本拆成数组
    const reqArray = requirements
      .split("\n")
      .map((r) => r.trim())
      .filter(Boolean);
    onUpdateTeam({
      name,
      description,
      goals,
      requirements: reqArray,
    });
  };

  const handleRemoveMember = async (memberId: number) => {
    if (window.confirm("你确定要删除该成员吗？")) {
      try {
        await onRemoveMember(team.id, memberId);
        toast.success("成员已成功移除。");
      } catch (error) {
        toast.error("移除成员失败，请重试。");
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="pt-20" size="xl">
      <ModalContent>
        <ModalHeader>编辑队伍</ModalHeader>
        <ModalBody>
          <Input
            label="队伍名称"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mb-4"
          />
          <Textarea
            label="描述"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mb-4"
          />
          <Textarea
            label="目标"
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            className="mb-4"
          />
          <Textarea
            label="需求"
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            placeholder="每行输入一个需求"
            className="mb-4"
          />
          <div>
            <h3 className="text-lg font-semibold mb-2">队伍成员</h3>
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between mb-2"
              >
                <div className="flex items-center gap-2">
                  <Avatar
                    src={member.avatarUrl || undefined}
                    name={member.name}
                  />
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-gray-500">{member.role}</p>
                  </div>
                </div>
                {member.role !== "队长" && (
                  <Tooltip content="踢出该成员" placement="bottom">
                    <Button
                      isIconOnly
                      size="sm"
                      color="danger"
                      variant="light"
                      onPress={() => handleRemoveMember(member.id)}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </Tooltip>
                )}
              </div>
            ))}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            取消
          </Button>
          <Button color="primary" onPress={handleSubmit}>
            保存更改
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
