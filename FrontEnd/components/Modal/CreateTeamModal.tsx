import React, { useState } from "react";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalContent,
  Input,
  Textarea,
  Select,
  SelectItem,
  Button,
} from "@heroui/react";

// 【新增】传入比赛类型
type Competition = {
  id: number;
  name: string;
};

type CreateTeamModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreateTeam: (teamData: {
    name: string;
    description: string;
    goals: string;
    requirements: string[];
    maxMembers: number;
    competition_id: number; // 【新增】比赛ID
  }) => void;
  competitions: Competition[]; // 【新增】比赛列表
};

export const CreateTeamModal: React.FC<CreateTeamModalProps> = ({
  isOpen,
  onClose,
  onCreateTeam,
  competitions, // 【新增】
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [goals, setGoals] = useState("");
  const [requirements, setRequirements] = useState<string[]>([]);
  const [maxMembers, setMaxMembers] = useState(5);

  // 【新增】比赛选择状态
  const [competitionId, setCompetitionId] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 【新增】检查是否选择了比赛
    if (!competitionId) {
      alert("请选择所属比赛");
      return;
    }

    onCreateTeam({
      name,
      description,
      goals,
      requirements,
      maxMembers,
      competition_id: competitionId, // 【新增】
    });
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setGoals("");
    setRequirements([]);
    setMaxMembers(5);
    setCompetitionId(null); // 【新增】重置比赛选择
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
      <ModalContent>
        <>
          <ModalHeader className="flex flex-col gap-1">创建新队伍</ModalHeader>
          <ModalBody>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="队伍名称"
                placeholder="输入队伍名称"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Textarea
                label="队伍简介"
                placeholder="输入队伍简介"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              <Select
                label="目标"
                placeholder="选择队伍目标"
                selectedKeys={goals ? [goals] : []}
                onSelectionChange={(keys) =>
                  setGoals(Array.from(keys)[0] as string)
                }
                required
              >
                <SelectItem key="冲奖保奖">冲奖保奖</SelectItem>
                <SelectItem key="创业落地">创业落地</SelectItem>
                <SelectItem key="论文专利">论文专利</SelectItem>
                <SelectItem key="保研加分">保研加分</SelectItem>
                <SelectItem key="兴趣参与">兴趣参与</SelectItem>
              </Select>
              <Select
                label="需求"
                placeholder="选择队伍需求"
                selectionMode="multiple"
                selectedKeys={new Set(requirements)}
                onSelectionChange={(keys) =>
                  setRequirements(Array.from(keys) as string[])
                }
                required
              >
                <SelectItem key="项目负责人">项目负责人</SelectItem>
                <SelectItem key="技术开发">技术开发</SelectItem>
                <SelectItem key="商业策划">商业策划</SelectItem>
                <SelectItem key="美工">美工</SelectItem>
                <SelectItem key="路演">路演</SelectItem>
                <SelectItem key="数据分析">数据分析</SelectItem>
                <SelectItem key="数论手">数论手</SelectItem>
                <SelectItem key="图论手">图论手</SelectItem>
                <SelectItem key="数据结构">数据结构</SelectItem>
              </Select>
              <Input
                type="number"
                label="最大成员数"
                placeholder="输入最大成员数"
                value={maxMembers.toString()}
                onChange={(e) => setMaxMembers(parseInt(e.target.value))}
                min={1}
                max={10}
                required
              />

              {/* 【新增】所属比赛选择 */}
              <Select
                label="所属比赛"
                placeholder="请选择比赛"
                selectedKeys={competitionId ? [competitionId.toString()] : []}
                onSelectionChange={(keys) =>
                  setCompetitionId(Number(Array.from(keys)[0]))
                }
                required
              >
                {/* 遍历比赛列表 */}
                {competitions.map((comp) => (
                  <SelectItem key={comp.id.toString()}>{comp.name}</SelectItem>
                ))}
              </Select>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              取消
            </Button>
            <Button color="primary" onClick={handleSubmit}>
              创建
            </Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
};
