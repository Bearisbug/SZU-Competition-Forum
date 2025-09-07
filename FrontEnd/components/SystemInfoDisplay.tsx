import React from "react";
import { Card, CardHeader, CardBody, Accordion, AccordionItem, Button, Tooltip } from "@heroui/react";
import toast from "react-hot-toast";
import { Check, X, Trash, Trash2 } from 'lucide-react';

type SystemInfo = {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  canAct?: boolean; // 是否可进行批准/拒绝操作（仅对入队申请类通知有效）
};

interface SystemInfoDisplayProps {
  infoList: SystemInfo[];
  onApprove: (teamId: number, userId: number) => Promise<void>;
  onReject: (teamId: number, userId: number) => Promise<void>;
  onDelete: (notificationId: string) => Promise<void>;
  onClearAll: () => Promise<void>;
}

function SystemInfoDisplay({
  infoList,
  onApprove,
  onReject,
  onDelete,
  onClearAll,
}: SystemInfoDisplayProps) {
  const parseJoinRequest = (content: string) => {
    // 1) Try JSON payloads if the backend ever sends structured content
    try {
      const obj = JSON.parse(content);
      if (
        obj &&
        typeof obj.userId === "number" &&
        typeof obj.teamId === "number" &&
        typeof obj.username === "string" &&
        typeof obj.teamName === "string"
      ) {
        return {
          username: obj.username as string,
          userId: obj.userId as number,
          teamName: obj.teamName as string,
          teamId: obj.teamId as number,
        };
      }
    } catch (_) {
      // not JSON; continue to regex parsing
    }

    // 2) Current backend format: "用户 {name}(ID: {uid}) 申请加入队伍 {team}(ID: {tid})"
    let m = /用户\s*(.+?)\(ID:\s*(\d+)\)\s*申请加入队伍\s*(.+?)\(ID:\s*(\d+)\)/.exec(content);
    if (m) {
      const [, username, userId, teamName, teamId] = m;
      return {
        username,
        userId: Number(userId),
        teamName,
        teamId: Number(teamId),
      };
    }

    // 3) Legacy format (more verbose Chinese punctuation)
    m = /用户名为\s*(.+?)，\s*用户\s*ID\s*为\s*(\d+)\s*申请加入队伍\s*(.+?)\s*\(队伍\s*ID[:：]\s*(\d+)\)/.exec(
      content
    );
    if (m) {
      const [, username, userId, teamName, teamId] = m;
      return {
        username,
        userId: Number(userId),
        teamName,
        teamId: Number(teamId),
      };
    }

    return null;
  };

  const handleAction = async (action: "approve" | "reject", content: string) => {
    const parsed = parseJoinRequest(content);
    if (!parsed) {
      toast.error("无法解析通知内容，请修复这个问题。");
      return;
    }
    const { username, userId, teamName, teamId } = parsed;
  
    try {
      if (action === "approve") {
        await onApprove(Number(teamId), Number(userId));
        toast.success(`已批准 ${username} 加入 ${teamName}`);
      } else {
        await onReject(Number(teamId), Number(userId));
        toast.success(`已拒绝 ${username} 加入 ${teamName}`);
      }
    } catch (error) {
      toast.error(`操作失败：${error}`);
    }
  };

  return (
    <Card className="max-w-[600px] mx-auto">
      <CardHeader className="flex justify-between items-center">
        <h2 className="text-2xl font-bold p-1">系统信息</h2>
        {infoList.length > 0 && (
          <Tooltip content="清空所有通知" placement="bottom">
            <Button
              isIconOnly
              color="danger"
              size="sm"
              onClick={onClearAll}
              aria-label="清空所有通知"
            >
              <Trash2 size={20} />
            </Button>
          </Tooltip>
        )}
      </CardHeader>
      <CardBody>
        {infoList.length === 0 ? (
          <div className="py-12 text-center text-gray-400">暂无消息</div>
        ) : (
          <Accordion>
            {infoList.map((info) => (
              <AccordionItem
                key={info.id}
                aria-label={info.title}
                title={info.title}
                subtitle={<span className="text-xs text-gray-400">{info.timestamp}</span>}
              >
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-gray-700">{info.content}</p>
                  <div className="flex justify-end gap-2">
                    {info.content.includes("申请加入队伍") && info.canAct === true && (
                      <>
                        <Tooltip content="批准" placement="bottom">
                          <Button
                            isIconOnly
                            color="success"
                            size="sm"
                            onClick={() => handleAction("approve", info.content)}
                            aria-label="批准"
                          >
                            <Check size={16} />
                          </Button>
                        </Tooltip>
                        <Tooltip content="拒绝" placement="bottom">
                          <Button
                            isIconOnly
                            color="danger"
                            size="sm"
                            onClick={() => handleAction("reject", info.content)}
                            aria-label="拒绝"
                          >
                            <X size={16} />
                          </Button>
                        </Tooltip>
                      </>
                    )}
                    <Tooltip content="删除" placement="bottom">
                      <Button
                        isIconOnly
                        color="primary"
                        size="sm"
                        onClick={() => onDelete(info.id)}
                        aria-label="删除"
                      >
                        <Trash size={16} />
                      </Button>
                    </Tooltip>
                  </div>
                </div>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardBody>
    </Card>
  );
}

export default SystemInfoDisplay;
