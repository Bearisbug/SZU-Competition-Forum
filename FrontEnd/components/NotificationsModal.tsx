"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Modal, ModalContent, ModalBody, ModalHeader, Button, Tooltip } from "@heroui/react";
import SystemInfoDisplay from "@/components/SystemInfoDisplay";
import toast from "react-hot-toast";
import { API_BASE_URL } from "@/CONFIG";
import { formatDate } from "@/lib/date";
import { Trash2 } from 'lucide-react';

type SystemInfo = {
  id: string;
  title: string;
  content: string;
  timestamp: string; // for display
  rawTs: string;     // original ISO timestamp for comparisons
  canAct?: boolean;
};

export default function NotificationsModal({
  isOpen,
  onOpenChangeAction,
}: {
  isOpen: boolean;
  onOpenChangeAction: (open?: boolean) => void;
}) {
  const [systemInfo, setSystemInfo] = useState<SystemInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const parseJoinRequest = (content: string) => {
    try {
      const obj = JSON.parse(content);
      if (
        obj &&
        typeof obj.userId === "number" &&
        typeof obj.teamId === "number"
      ) {
        return { userId: obj.userId as number, teamId: obj.teamId as number };
      }
    } catch (_) {}
    let m = /用户\s*(.+?)\(ID:\s*(\d+)\)\s*申请加入队伍\s*(.+?)\(ID:\s*(\d+)\)/.exec(content);
    if (m) {
      return { userId: Number(m[2]), teamId: Number(m[4]) };
    }
    m = /用户名为\s*(.+?)，\s*用户\s*ID\s*为\s*(\d+)\s*申请加入队伍\s*(.+?)\s*\(队伍\s*ID[:：]\s*(\d+)\)/.exec(
      content
    );
    if (m) {
      return { userId: Number(m[2]), teamId: Number(m[4]) };
    }
    return null;
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/notifications`, {
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem("access_token") : ''}`,
        },
      });
      const data = await response.json();

      const baseList: SystemInfo[] = data.map((item: any) => ({
        id: item.id.toString(),
        title: item.title,
        content: item.content,
        timestamp: formatDate(item.timestamp),
        rawTs: item.timestamp,
      }));

      const joins = baseList
        .map((n) => ({ n, parsed: parseJoinRequest(n.content) }))
        .filter((x) => x.parsed !== null) as {
        n: SystemInfo;
        parsed: { userId: number; teamId: number };
      }[];

      const teamIds = Array.from(new Set(joins.map((j) => j.parsed.teamId)));
      const token = typeof window !== 'undefined' ? localStorage.getItem("access_token") : '';
      const teamDetails = await Promise.all(
        teamIds.map(async (tid) => {
          try {
            const r = await fetch(`${API_BASE_URL}/api/teams/${tid}/detail`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (!r.ok) return { teamId: tid, members: [] as any[] };
            const detail = await r.json();
            return { teamId: tid, members: Array.isArray(detail.members) ? detail.members : [] };
          } catch {
            return { teamId: tid, members: [] as any[] };
          }
        })
      );
      const teamMap = new Map<number, any[]>(teamDetails.map((d) => [d.teamId, d.members]));

      const listWithActFlag = baseList.map((n) => {
        const p = parseJoinRequest(n.content);
        if (!p) return n;
        const members = teamMap.get(p.teamId) || [];
        const pending = members.some((m: any) => Number(m.user_id) === p.userId && Number(m.status) === 0);
        return { ...n, canAct: pending } as SystemInfo;
      });

      setSystemInfo(listWithActFlag);
    } catch (error) {
      console.error(error);
      toast.error("加载通知失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchNotifications();
  }, [isOpen]);

  const handleApprove = async (teamId: number, userId: number) => {
    const response = await fetch(
      `${API_BASE_URL}/api/teams/${teamId}/approve/${userId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem("access_token") : ''}`,
        },
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "批准操作失败");
    }
    fetchNotifications();
  };

  const handleReject = async (teamId: number, userId: number) => {
    const response = await fetch(
      `${API_BASE_URL}/api/teams/${teamId}/reject/${userId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem("access_token") : ''}`,
        },
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "拒绝操作失败");
    }
    fetchNotifications();
  };

  const handleDeleteNotification = async (notificationId: string) => {
    // 前置校验：如果该通知是待审批的入队申请，则禁止删除
    const target = systemInfo.find((n) => n.id === notificationId);
    if (target && target.content.includes("申请加入队伍") && target.canAct) {
      toast.error("存在未处理的入队申请，无法删除该通知");
      return;
    }
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/notifications/${notificationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem("access_token") : ''}`,
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "删除通知失败");
      }
      toast.success("通知已删除");
      fetchNotifications();
    } catch (error) {
      toast.error(`操作失败：${error}`);
    }
  };

  const handleClearAllNotifications = async () => {
    // 前置校验：若存在未处理申请，则禁止清空
    if (systemInfo.some((n) => n.content.includes("申请加入队伍") && n.canAct)) {
      toast.error("存在未处理的入队申请，无法清空通知");
      return;
    }
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/notifications/clear/all`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem("access_token") : ''}`,
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "清空通知失败");
      }
      toast.success("所有通知已清空");
      fetchNotifications();
    } catch (error) {
      toast.error(`操作失败：${error}`);
    }
  };

  // 用于上层记录“最新消息时间”，以显示红点
  const latestTimestamp = useMemo(() => {
    if (!systemInfo.length) return 0;
    const times = systemInfo
      .map((n) => new Date(n.rawTs).getTime())
      .filter((t) => !isNaN(t));
    return times.length ? Math.max(...times) : 0;
  }, [systemInfo]);

  useEffect(() => {
    if (!isOpen) return;
    // 将最新时间写入 localStorage，供导航红点使用
    if (latestTimestamp) {
      localStorage.setItem("notifications:lastSeen", String(latestTimestamp));
    } else {
      localStorage.setItem("notifications:lastSeen", String(Date.now()));
    }
  }, [isOpen, latestTimestamp]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChangeAction}
      scrollBehavior="inside"
      size="lg"
      placement="center"
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex justify-between items-center pr-12">
              <span className="text-xl font-bold">系统信息</span>
              {systemInfo.length > 0 && (
                <Tooltip content="清空所有通知" placement="bottom">
                  <Button
                    isIconOnly
                    color="danger"
                    size="sm"
                    onClick={handleClearAllNotifications}
                    aria-label="清空所有通知"
                  >
                    <Trash2 size={20} />
                  </Button>
                </Tooltip>
              )}
            </ModalHeader>
            <ModalBody className="p-2 max-h-[80vh] overflow-y-auto">
              <SystemInfoDisplay
                infoList={systemInfo}
                onApprove={handleApprove}
                onReject={handleReject}
                onDelete={handleDeleteNotification}
                onClearAll={handleClearAllNotifications}
              />
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
