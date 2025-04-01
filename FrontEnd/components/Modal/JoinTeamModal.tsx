"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
} from "@heroui/react";

interface JoinTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoin: (reason: string) => void;
}

export function JoinTeamModal({ isOpen, onClose, onJoin }: JoinTeamModalProps) {
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    onJoin(reason);
    setReason("");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>申请加入队伍</ModalHeader>
        <ModalBody>
          <Textarea
            label="加入理由"
            placeholder="请输入加入该队伍的理由"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            取消
          </Button>
          <Button color="primary" onPress={handleSubmit} disabled={!reason.trim()}>
            提交申请
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}