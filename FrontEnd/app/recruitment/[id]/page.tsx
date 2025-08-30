'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  Card, 
  CardBody, 
  CardHeader,
  Button,
  Avatar,
  Divider,
  Spinner,
  Chip
} from '@heroui/react';
import { ArrowLeft, MapPin, Clock, Edit, Trash2 } from 'lucide-react';
import { AuthGuard, useAuth } from '@/lib/auth-guards';
import { API_BASE_URL } from '@/CONFIG';
import { Recruitment } from '@/components/Card/RecruitmentCard';
import toast from 'react-hot-toast';

function RecruitmentDetailPageContent() {
  const router = useRouter();
  const params = useParams();
  const recruitmentId = params.id as string;
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  
  const [recruitment, setRecruitment] = useState<Recruitment | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 获取招聘信息详情
  useEffect(() => {
    const fetchRecruitment = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_BASE_URL}/api/recruitments/detail/${recruitmentId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('获取招聘信息失败');
        }

        const data = await response.json();
        setRecruitment(data);
      } catch (error) {
        console.error('获取招聘信息错误:', error);
        toast.error('获取招聘信息失败，请稍后重试');
        router.push('/recruitment');
      } finally {
        setLoading(false);
      }
    };

    if (recruitmentId) {
      fetchRecruitment();
    }
  }, [recruitmentId, router]);

  // 处理编辑
  const handleEdit = () => {
    router.push(`/recruitment/${recruitmentId}/edit`);
  };

  // 处理删除
  const handleDelete = async () => {
    if (!window.confirm('确定要删除这条招聘信息吗？此操作不可撤销。')) {
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/api/recruitments/${recruitmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('删除失败');
      }

      toast.success('招聘信息已删除');
      router.push('/recruitment');
    } catch (error) {
      console.error('删除招聘信息错误:', error);
      toast.error('删除失败，请稍后重试');
    }
  };

  if (loading) {
    return (
      <div 
        className="min-h-screen bg-gray-50 flex items-center justify-center"
        style={{ paddingTop: mounted ? "114px" : "60px" }}
      >
        <Spinner size="lg" />
      </div>
    );
  }

  if (!recruitment) {
    return (
      <div 
        className="min-h-screen bg-gray-50 flex items-center justify-center"
        style={{ paddingTop: mounted ? "114px" : "60px" }}
      >
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <div className="text-xl text-gray-500 mb-4">招聘信息不存在</div>
          <Button color="primary" onPress={() => router.push('/recruitment')}>
            返回招聘列表
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gray-50"
      style={{ paddingTop: mounted ? "114px" : "60px" }}
    >
      <div className="max-w-4xl mx-auto p-4">
        {/* 顶部导航 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button
              variant="light"
              startContent={<ArrowLeft size={20} />}
              onPress={() => router.back()}
              className="mr-4"
            >
              返回
            </Button>
            <h1 className="text-3xl font-bold text-gray-800">招聘详情</h1>
          </div>
          
          {/* 管理员操作按钮 */}
          {isAdmin && (
            <div className="flex gap-2">
              <Button
                color="primary"
                variant="flat"
                startContent={<Edit size={16} />}
                onPress={handleEdit}
              >
                编辑
              </Button>
              <Button
                color="danger"
                variant="flat"
                startContent={<Trash2 size={16} />}
                onPress={handleDelete}
              >
                删除
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* 老师信息卡片 */}
          <Card>
            <CardBody className="p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar
                  src={recruitment.teacher_avatar_url}
                  name={recruitment.teacher_name}
                  size="lg"
                  className="mb-4"
                  fallback={
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-500 text-2xl font-medium">
                        {recruitment.teacher_name.charAt(0)}
                      </span>
                    </div>
                  }
                />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {recruitment.teacher_name}
                </h2>
                
                {recruitment.institution && (
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin size={16} className="mr-2" />
                    <span>{recruitment.institution}</span>
                  </div>
                )}
                
                <div className="flex items-center text-sm text-gray-500">
                  <Clock size={14} className="mr-1" />
                  发布于 {new Date(recruitment.created_at).toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </CardBody>
          </Card>

          {/* 项目简介 */}
          {recruitment.project_summary && (
            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold text-gray-800">项目简介</h3>
              </CardHeader>
              <Divider />
              <CardBody>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {recruitment.project_summary}
                </p>
              </CardBody>
            </Card>
          )}

          {/* 招聘信息 */}
          {recruitment.recruitment_info && (
            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold text-gray-800">招聘信息</h3>
              </CardHeader>
              <Divider />
              <CardBody>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {recruitment.recruitment_info}
                </p>
              </CardBody>
            </Card>
          )}

          {/* 考核方式 */}
          {recruitment.assessment_method && (
            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold text-gray-800">考核方式</h3>
              </CardHeader>
              <Divider />
              <CardBody>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {recruitment.assessment_method}
                </p>
              </CardBody>
            </Card>
          )}

          {/* 联系方式 */}
          {Object.keys(recruitment.contacts).length > 0 && (
            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold text-gray-800">联系方式</h3>
              </CardHeader>
              <Divider />
              <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(recruitment.contacts).map(([type, value]) => (
                    <div key={type} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <span className="text-gray-600 font-medium">{type}</span>
                      </div>
                      <span className="text-gray-900 font-semibold tracking-wide">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}

          {/* 底部信息 */}
          <Card>
            <CardBody className="p-4">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>招聘信息ID: {recruitment.card_id}</span>
                <span>
                  最后更新: {new Date(recruitment.updated_at).toLocaleString('zh-CN')}
                </span>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function RecruitmentDetailPage() {
  return (
    <AuthGuard>
      <RecruitmentDetailPageContent />
    </AuthGuard>
  );
}