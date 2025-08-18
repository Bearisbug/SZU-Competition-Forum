"use client";

import React, { useState, useEffect } from "react";
import {
  Button,
  Tabs,
  Tab,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Textarea,
  Accordion,
  AccordionItem,
  Card,
  CardHeader,
  CardBody,
  Spinner,
  Tooltip,
} from "@heroui/react";
import toast from "react-hot-toast";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { TeamSelectionModal } from "@/components/Modal/TeamSelectionModal";
import { Trash2, Plus, ArrowLeft, Trophy, Calendar, Users, Info, Megaphone, PlusCircle } from 'lucide-react';

// 强制动态渲染
export const dynamic = 'force-dynamic';

export type Competition = {
  id: number;
  name: string;
  sign_up_start_time: string;
  sign_up_end_time: string;
  competition_start_time: string;
  competition_end_time: string;
  details: string;
  organizer: string;
  competition_type: string;
  cover_image: string;
  created_at: string;
  updated_at: string;
  announcements?: CompetitionAnnouncement[];
};

type CompetitionAnnouncement = {
  id: number;
  competition_id: number;
  title: string;
  content: string;
  published_at: string;
};

export default function CompetitionDetailPage() {
  const params = useParams();
  const id = params.id;
  const router = useRouter();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [announcements, setAnnouncements] = useState<CompetitionAnnouncement[]>([]);
  const [newAnnouncementTitle, setNewAnnouncementTitle] = useState("");
  const [newAnnouncementContent, setNewAnnouncementContent] = useState("");
  const [showTeamModal, setShowTeamModal] = useState(false);

  useEffect(() => {
    const fetchCompetition = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/competitions/detail/${id}`,
          {
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem("access_token") : ''}`,
        },
          }
        );
        if (!response.ok) {
          throw new Error("获取比赛详情失败");
        }
        const data: Competition = await response.json();
        setCompetition(data);
        setAnnouncements(data.announcements || []);
      } catch (error) {
        console.error(error);
        toast.error("无法加载比赛详情");
      }
    };
    if (id) {
      fetchCompetition();
    }
  }, [id]);

  const handlePublishAnnouncement = async () => {
    if (!newAnnouncementTitle || !newAnnouncementContent) {
      toast.error("请填写完整的公告标题和内容");
      return;
    }

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/competitions/detail/${id}/announcements`,
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
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "公告发布失败");
      }
      const createdAnn: CompetitionAnnouncement = await res.json();

      setAnnouncements((prev) => [createdAnn, ...prev]);
      setNewAnnouncementTitle("");
      setNewAnnouncementContent("");
      onOpenChange();
      toast.success("公告发布成功！");
    } catch (error) {
      console.error(error);
      toast.error("公告发布失败，请检查权限或稍后重试");
    }
  };

  const handleTeamSelect = async (teamId: number) => {
    setShowTeamModal(false);
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/competitions/${id}/register/${teamId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem("access_token") : ''}`,
          },
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "报名失败");
      }
      toast.success(`已成功为队伍 #${teamId} 报名比赛！`);
    } catch (error) {
      toast.error(String(error));
    }
  };

  const handleDeleteAnnouncement = async (announcementId: number) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/competitions/detail/${id}/announcements/${announcementId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem("access_token") : ''}`,
          },
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "公告删除失败");
      }
      setAnnouncements((prev) =>
        prev.filter((announcement) => announcement.id !== announcementId)
      );
      toast.success("公告删除成功");
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "公告删除失败");
    }
  };

  if (!competition) {
    return (
      <div className="flex justify-center items-center h-screen gap-4">
        <Spinner size="lg" color="primary" />
        <p>加载中...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="relative w-full h-[50vh] mb-8">
        <Image
          src={competition.cover_image}
          alt={competition.name}
          fill
          priority
          className="object-cover shadow-md transition-transform duration-500"
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <Button onClick={() => router.push("/competition")} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回列表
        </Button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-4">
          <h1 className="text-3xl font-bold mb-4 md:mb-0 flex items-center">
            <Trophy className="w-8 h-8 mr-2 text-primary" />
            {competition.name}
          </h1>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="text-sm text-gray-600">
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                报名时间
              </span>
              <div>
                {competition.sign_up_start_time} ~{" "}
                {competition.sign_up_end_time}
              </div>
              <div className="text-gray-400">报名开放</div>
            </div>
            <Button color="primary" onClick={() => setShowTeamModal(true)}>
              <PlusCircle className="w-4 h-4" />
              立即报名
            </Button>
          </div>
        </div>

        <Tabs aria-label="比赛部分" color="primary">
          <Tab key="details" title={
            <div className="flex items-center">
              <Info className="w-4 h-4 mr-2" />
              比赛详情
            </div>
          }>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
              <div className="lg:col-span-2">
                <Card className="p-6 shadow-lg">
                  <h2 className="text-2xl font-semibold mb-4">详细说明</h2>
                  <p className="text-gray-700 mb-6" dangerouslySetInnerHTML={{ __html: competition.details }} />
                </Card>
              </div>

              <div className="lg:col-span-1">
                <Card className="p-4 shadow-lg">
                  <h2 className="text-xl font-semibold mb-4">时间线</h2>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-primary" />
                      <strong>注册时间：</strong> <br />
                      {competition.sign_up_start_time} ~
                      <br />
                      {competition.sign_up_end_time}
                    </li>
                    <li className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-primary" />
                      <strong>比赛时间：</strong> <br />
                      {competition.competition_start_time} ~
                      <br />
                      {competition.competition_end_time}
                    </li>
                    <li className="flex items-center">
                      <Trophy className="w-4 h-4 mr-2 text-primary" />
                      <strong>比赛类型：</strong> {competition.competition_type}
                    </li>
                    <li className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-primary" />
                      <strong>主办方：</strong> {competition.organizer}
                    </li>
                  </ul>
                </Card>
              </div>
            </div>
          </Tab>
          <Tab key="announcements" title={
            <div className="flex items-center">
              <Megaphone className="w-4 h-4 mr-2" />
              公告
            </div>
          }>
            <div className="mt-2">
              <Card className="w-full mx-auto">
                <CardHeader className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold p-1">比赛公告</h2>
                  <div className="flex gap-2">
                    <Tooltip content="发布新公告" placement="bottom">
                      <Button
                        isIconOnly
                        color="primary"
                        size="sm"
                        onClick={onOpen}
                        aria-label="发布新公告"
                      >
                        <Plus size={20} />
                      </Button>
                    </Tooltip>
                  </div>
                </CardHeader>
                <CardBody>
                  <Accordion>
                    {announcements.map((announcement) => (
                      <AccordionItem
                        key={announcement.id}
                        aria-label={announcement.title}
                        title={announcement.title}
                        subtitle={<span className="text-xs text-gray-400">{announcement.published_at}</span>}
                      >
                        <div className="flex flex-col gap-2">
                          <p className="text-sm text-gray-700">{announcement.content}</p>
                          <div className="flex justify-end gap-2">
                            <Tooltip content="删除公告" placement="bottom">
                              <Button
                                isIconOnly
                                color="default"
                                size="sm"
                                onClick={() => handleDeleteAnnouncement(announcement.id)}
                                aria-label="删除公告"
                              >
                                <Trash2 size={16} />
                              </Button>
                            </Tooltip>
                          </div>
                        </div>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardBody>
              </Card>

              <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                  {(onClose) => (
                    <>
                      <ModalHeader className="flex flex-col gap-1">
                        发布公告
                      </ModalHeader>
                      <ModalBody>
                        <Input
                          label="标题"
                          placeholder="输入公告标题"
                          value={newAnnouncementTitle}
                          onChange={(e) =>
                            setNewAnnouncementTitle(e.target.value)
                          }
                        />
                        <Textarea
                          label="内容"
                          placeholder="输入公告内容"
                          value={newAnnouncementContent}
                          onChange={(e) =>
                            setNewAnnouncementContent(e.target.value)
                          }
                        />
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          color="danger"
                          variant="light"
                          onPress={onClose}
                        >
                          取消
                        </Button>
                        <Button
                          color="primary"
                          onPress={handlePublishAnnouncement}
                        >
                          发布
                        </Button>
                      </ModalFooter>
                    </>
                  )}
                </ModalContent>
              </Modal>
            </div>
          </Tab>
        </Tabs>
      </div>

      <TeamSelectionModal
        isOpen={showTeamModal}
        onClose={() => setShowTeamModal(false)}
        onSelectTeam={handleTeamSelect}
      />
    </div>
  );
}
