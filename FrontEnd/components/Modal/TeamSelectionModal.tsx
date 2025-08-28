'use client';

import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";
import { Team, TeamMember, TeamCard } from '../Card/TeamCard';
import toast from 'react-hot-toast';
import { API_BASE_URL } from "@/CONFIG";

interface TeamSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTeam: (teamId: number) => void;
}

export function TeamSelectionModal({ isOpen, onClose, onSelectTeam }: TeamSelectionModalProps) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamMembers, setTeamMembers] = useState<Record<number, TeamMember[]>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchTeams();
    }
  }, [isOpen]);

  const fetchTeams = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/teams/my-captain-teams`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('获取队伍失败');
      }

      const data: { team: Team; members: TeamMember[] }[] = await response.json();

      if (!data || data.length === 0) {
        toast.error('你没有领导的队伍');
        onClose();
        return;
      }

      const formattedTeams = data.map((item) => ({
        ...item.team,
        requirements: item.team.requirements.flatMap((req: string) =>
          req.split("\n")
        ), // 确保 requirements 是数组
      }));
      const membersData = data.reduce(
        (acc, item) => ({ ...acc, [item.team.id]: item.members }),
        {}
      );

      setTeams(formattedTeams);
      setTeamMembers(membersData);
      setCurrentIndex(0);
      setSelectedTeamId(null);
    } catch (error) {
      console.error(error);
      toast.error('获取队伍信息失败');
      onClose();
    }
  };

  const handlePrev = () => {
    if (isAnimating || currentIndex === 0) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (isAnimating || currentIndex >= teams.length - 1) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const mockTeamActions = {
    onJoinTeam: async () => { toast.error("你没办法在此页面进行该操作！")},
    onLeaveTeam: async () => {toast.error("你没办法在此页面进行该操作！")},
    onUpdateTeam: async () => {toast.error("你没办法在此页面进行该操作！")},
    onDisbandTeam: async () => {toast.error("你没办法在此页面进行该操作！")},
    onRemoveMember: async () => {toast.error("你没办法在此页面进行该操作！")},
  }

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  const handleConfirm = () => {
    if (selectedTeamId !== null) {
      onSelectTeam(selectedTeamId);
    } else {
      toast.error('请选择一个队伍');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
      <ModalContent>
        {(closeModal) => (
          <>
            <ModalHeader className="flex flex-col gap-1">选择参赛队伍</ModalHeader>
            <ModalBody>
              <div className="flex items-center gap-4">
                <Button
                  isIconOnly
                  aria-label="上一页"
                  variant="light"
                  onPress={handlePrev}
                  isDisabled={isAnimating || currentIndex === 0}
                >
                  {'<'}
                </Button>
                <div className="flex-1 overflow-hidden relative">
                  <div
                    className="flex transition-all duration-500 ease-in-out"
                    style={{
                      transform: `translateX(-${currentIndex * 100}%)`,
                    }}
                  >
                    {teams.map((team, index) => (
                      <div key={team.id || `team-${index}`} className="w-full flex-shrink-0">
                        <div
                          className={`border-4 rounded-lg ${
                            selectedTeamId === team.id ? 'border-primary' : 'border-transparent'
                          }`}
                          onClick={() => setSelectedTeamId(team.id)}
                        >
                          <TeamCard
                            team={team}
                            members={teamMembers[team.id] || []}
                            //@ts-ignore
                            {...mockTeamActions}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <Button
                  isIconOnly
                  aria-label="下一页"
                  variant="light"
                  onPress={handleNext}
                  isDisabled={isAnimating || currentIndex >= teams.length - 1}
                >
                  {'>'}
                </Button>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={closeModal}>
                取消
              </Button>
              <Button color="primary" onPress={handleConfirm} isDisabled={selectedTeamId === null}>
                确定
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
