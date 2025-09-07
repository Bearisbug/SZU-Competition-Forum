'use client';

import React from 'react';
import { Card, CardBody, Button, Avatar } from '@heroui/react';
import { Edit, Trash2, MapPin, Clock } from 'lucide-react';
import { formatDate } from "@/lib/date";

export interface Recruitment {
  id: number;
  card_id: string;
  creator_id: number;
  teacher_name: string;
  teacher_avatar_url?: string;
  institution?: string;
  project_summary?: string;
  recruitment_info?: string;
  assessment_method?: string;
  contacts: Record<string, string>;
  created_at: string;
  updated_at: string;
}

interface RecruitmentCardProps {
  recruitment: Recruitment;
  currentUserId?: number;
  currentUserRole?: string;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export default function RecruitmentCard({
  recruitment,
  currentUserId,
  currentUserRole,
  onEdit,
  onDelete,
}: RecruitmentCardProps) {
  const handleEdit = () => {
    onEdit?.(recruitment.id);
  };

  const handleDelete = () => {
    onDelete?.(recruitment.id);
  };

  // 判断当前用户是否可以编辑/删除此招募信息
  const canEdit = () => {
    if (!currentUserId || !currentUserRole) return false;
    // 管理员可以编辑所有招募信息
    if (currentUserRole.toLowerCase() === 'admin') return true;
    // 创建者可以编辑自己的招募信息
    return recruitment.creator_id === currentUserId;
  };

  // 格式化联系方式显示 - 显示所有联系方式
  const formatContacts = () => {
    return Object.entries(recruitment.contacts);
  };


  return (
    <Card 
      className="w-full bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 relative"
    >
      {/* 编辑和删除操作按钮 */}
      {canEdit() && (
        <div className="absolute top-3 right-3 z-10 flex gap-2">
          <Button
            isIconOnly
            size="sm"
            variant="flat"
            color="primary"
            className="bg-blue-100 hover:bg-blue-200"
            onPress={handleEdit}
          >
            <Edit size={14} />
          </Button>
          <Button
            isIconOnly
            size="sm"
            variant="flat"
            color="danger"
            className="bg-red-100 hover:bg-red-200"
            onPress={handleDelete}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      )}

      <CardBody className="p-6">
        {/* 老师头像和姓名 */}
        <div className="flex flex-col items-center mb-4">
          <Avatar
            src={recruitment.teacher_avatar_url}
            name={recruitment.teacher_name}
            size="lg"
            className="mb-3"
            fallback={
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-500 text-lg font-medium">
                  {recruitment.teacher_name.charAt(0)}
                </span>
              </div>
            }
          />
          <h3 className="text-lg font-semibold text-gray-900 text-center">
            {recruitment.teacher_name}
          </h3>
        </div>

        {/* 机构信息 */}
        {recruitment.institution && (
          <div className="flex items-center justify-center mb-4">
            <MapPin size={14} className="text-gray-500 mr-1" />
            <span className="text-sm text-gray-600">{recruitment.institution}</span>
          </div>
        )}

        {/* 项目简介 */}
        {recruitment.project_summary && (
          <div className="mb-4">
            <h4 className="text-base font-medium text-gray-800 mb-2">项目简介</h4>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">
              {recruitment.project_summary}
            </p>
          </div>
        )}

        {/* 招聘信息 */}
        {recruitment.recruitment_info && (
          <div className="mb-4">
            <h4 className="text-base font-medium text-gray-800 mb-2">招聘信息</h4>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">
              {recruitment.recruitment_info}
            </p>
          </div>
        )}

        {/* 考核方式 */}
        {recruitment.assessment_method && (
          <div className="mb-4">
            <h4 className="text-lg font-medium text-gray-800 mb-2">考核方式</h4>
            <div className="w-full h-px bg-gray-300 mb-3"></div>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">
              {recruitment.assessment_method}
            </p>
          </div>
        )}

        {/* 联系方式 */}
        {Object.keys(recruitment.contacts).length > 0 && (
          <div className="space-y-2">
            {formatContacts().map(([type, value]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{type}</span>
                <span className="text-sm font-medium text-gray-900 tracking-wide">
                  {value}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* 创建时间 */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-center text-xs text-gray-500">
            <Clock size={12} className="mr-1" />
            发布于 {formatDate(recruitment.created_at)}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
