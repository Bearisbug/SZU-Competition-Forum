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

type CreateTeamModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreateTeam: (teamData: {
    name: string;
    description: string;
    goals: string;
    requirements: string[];
    maxMembers: number;
  }) => void;
};

export const CreateTeamModal: React.FC<CreateTeamModalProps> = ({
  isOpen,
  onClose,
  onCreateTeam,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [goals, setGoals] = useState("");
  const [requirements, setRequirements] = useState<string[]>([]);
  const [maxMembers, setMaxMembers] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateTeam({
      name,
      description,
      goals,
      requirements,
      maxMembers,
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
                onSelectionChange={(keys) => setGoals(Array.from(keys)[0] as string)}
                required
              >
                <SelectItem key="Innovation">创新</SelectItem>
                <SelectItem key="Research">研究</SelectItem>
                <SelectItem key="Development">开发</SelectItem>
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
                <SelectItem key="Programming">编程</SelectItem>
                <SelectItem key="Design">设计</SelectItem>
                <SelectItem key="Management">管理</SelectItem>
                <SelectItem key="Marketing">市场营销</SelectItem>
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