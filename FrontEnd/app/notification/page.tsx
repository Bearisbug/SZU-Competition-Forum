"use client"
import React, { useState, useEffect } from "react";
import SystemInfoDisplay from "@/components/SystemInfoDisplay";
import toast from "react-hot-toast";
import { Spinner } from "@heroui/react";
import { API_BASE_URL } from "@/CONFIG";

type SystemInfo = {
    id: string;
    title: string;
    content: string;
    timestamp: string;
  };
const SystemInfoPage = () => {
  const [systemInfo, setSystemInfo] = useState<SystemInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/notifications`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token") || ''}`,
        },
      });
      const data = await response.json();
      const formattedData = data.map((item: any) => ({
        id: item.id.toString(),
        title: item.title,
        content: item.content,
        timestamp: new Date(item.timestamp).toLocaleString(),
      }));
      setSystemInfo(formattedData);
    } catch (error) {
      console.error(error);
      toast.error("加载通知失败");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (teamId: number, userId: number) => {
    const response = await fetch(
      `${API_BASE_URL}/teams/${teamId}/approve/${userId}`,
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
      `${API_BASE_URL}/teams/${teamId}/reject/${userId}`,
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

  useEffect(() => {
    fetchNotifications();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen gap-4">
        <Spinner size="lg" color="primary" />
        <p>加载中...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 mt-16">
      <SystemInfoDisplay
        infoList={systemInfo}
        onApprove={handleApprove}
        onReject={handleReject}
        onDelete={handleDeleteNotification}
        onClearAll={handleClearAllNotifications}
      />
    </div>
  );
};

export default SystemInfoPage;