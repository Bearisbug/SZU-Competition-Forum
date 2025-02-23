import React from "react";
import { Card, CardHeader, CardBody, Accordion, AccordionItem, Button, Tooltip } from "@nextui-org/react";
import toast from "react-hot-toast";
import { Check, X, Trash, Trash2 } from 'lucide-react';

type SystemInfo = {
  id: string;
  title: string;
  content: string;
  timestamp: string;
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
  const handleAction = async (action: "approve" | "reject", content: string) => {
    const match = /用户名为 (.+?)，用户 ID 为 (\d+) 申请加入队伍 (.+?) \(队伍 ID：(\d+)\)/.exec(content);
    if (!match) {
      toast.error("无法解析通知内容");
      return;
    }
    const [, username, userId, teamName, teamId] = match;
  
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
      </CardHeader>
      <CardBody>
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
                  {info.content.includes("申请加入队伍") && (
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
      </CardBody>
    </Card>
  );
}

export default SystemInfoDisplay;

