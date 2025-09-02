'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Input, 
  Button, 
  Textarea, 
  Card, 
  CardBody, 
  CardHeader,
  Divider,
  Spinner
} from '@heroui/react';
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react';
import { API_BASE_URL } from '@/CONFIG';
import toast from 'react-hot-toast';

interface ContactEntry {
  id: string;
  type: string;
  value: string;
}

export default function CreateRecruitmentPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const authCheckExecuted = useRef(false);
  
  // 表单状态
  const [teacherName, setTeacherName] = useState('');
  const [teacherAvatarUrl, setTeacherAvatarUrl] = useState('');
  const [institution, setInstitution] = useState('');
  const [projectSummary, setProjectSummary] = useState('');
  const [recruitmentInfo, setRecruitmentInfo] = useState('');
  const [assessmentMethod, setAssessmentMethod] = useState('');
  const [contacts, setContacts] = useState<ContactEntry[]>([
    { id: '1', type: '', value: '' }
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 检查登录状态和用户权限 - 只执行一次
  useEffect(() => {
    const checkAuthAndPermission = async () => {
      if (mounted && !authCheckExecuted.current) {
        authCheckExecuted.current = true;
        const token = localStorage.getItem('access_token');
        if (!token) {
          toast.error('请先登录');
          router.replace('/');
          return;
        }

        try {
          // 从本地存储获取用户ID
          const userId = localStorage.getItem('id');
          if (!userId) {
            throw new Error('用户ID不存在');
          }

          // 获取用户信息以检查权限
          const response = await fetch(`${API_BASE_URL}/api/user/info/${userId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error('获取用户信息失败');
          }

          const userData = await response.json();
          setUserRole(userData.role);
          setAuthChecked(true);
        } catch (error) {
          console.error('获取用户信息错误:', error);
          toast.error('验证用户权限失败');
          router.replace('/');
        }
      }
    };

    checkAuthAndPermission();
  }, [mounted, router]);

  const canCreateRecruitment = userRole === 'admin' || userRole === '教师';

  // 如果还没有挂载或还没有检查认证状态，显示加载
  if (!mounted || !authChecked) {
    return (
      <div 
        className="min-h-screen bg-gray-50 flex items-center justify-center"
        style={{ paddingTop: mounted ? "114px" : "60px" }}
      >
        <Spinner size="lg" />
      </div>
    );
  }

  if (!canCreateRecruitment) {
    return (
      <div 
        className="min-h-screen bg-gray-50 flex items-center justify-center"
        style={{ paddingTop: "114px" }}
      >
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <div className="text-xl text-gray-500 mb-4">权限不足</div>
          <p className="text-gray-400 mb-6">只有管理员和教师可以发布招聘信息</p>
          <Button color="primary" onPress={() => router.back()}>
            返回上一页
          </Button>
        </div>
      </div>
    );
  }

  // 添加联系方式
  const addContact = () => {
    const newId = Date.now().toString();
    setContacts([...contacts, { id: newId, type: '', value: '' }]);
  };

  // 删除联系方式
  const removeContact = (id: string) => {
    if (contacts.length > 1) {
      setContacts(contacts.filter(contact => contact.id !== id));
    }
  };

  // 更新联系方式
  const updateContact = (id: string, field: 'type' | 'value', value: string) => {
    setContacts(contacts.map(contact => 
      contact.id === id ? { ...contact, [field]: value } : contact
    ));
  };

  // 上传头像
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`${API_BASE_URL}/upload_image`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('上传头像失败');
      }

      const result = await response.json();
      setTeacherAvatarUrl(result.data.url);
      toast.success('头像上传成功');
    } catch (error) {
      console.error('上传头像错误:', error);
      toast.error('上传头像失败，请重试');
    }
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!teacherName.trim()) {
      toast.error('请填写老师姓名');
      return;
    }

    // 构建联系方式对象
    const contactsObj: Record<string, string> = {};
    contacts.forEach(contact => {
      if (contact.type.trim() && contact.value.trim()) {
        contactsObj[contact.type.trim()] = contact.value.trim();
      }
    });

    setLoading(true);

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/api/recruitments/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teacher_name: teacherName.trim(),
          teacher_avatar_url: teacherAvatarUrl.trim() || undefined,
          institution: institution.trim() || undefined,
          project_summary: projectSummary.trim() || undefined,
          recruitment_info: recruitmentInfo.trim() || undefined,
          assessment_method: assessmentMethod.trim() || undefined,
          contacts: Object.keys(contactsObj).length > 0 ? contactsObj : undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || '创建招聘信息失败');
      }

      toast.success('招聘信息创建成功');
      router.push('/recruitment');
    } catch (error) {
      console.error('创建招聘信息错误:', error);
      toast.error(error instanceof Error ? error.message : '创建失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-gray-50"
      style={{ paddingTop: mounted ? "114px" : "60px" }}
    >
      <div className="max-w-4xl mx-auto p-4">
        {/* 顶部导航 */}
        <div className="flex items-center mb-6">
          <Button
            variant="light"
            startContent={<ArrowLeft size={20} />}
            onPress={() => router.back()}
            className="mr-4"
          >
            返回
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">发布招聘信息</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 基本信息卡片 */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">基本信息</h2>
            </CardHeader>
            <Divider />
            <CardBody className="space-y-4">
              <Input
                label="老师姓名"
                placeholder="请输入老师姓名"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                isRequired
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  老师头像
                </label>
                {teacherAvatarUrl && (
                  <div className="mb-3">
                    <img
                      src={teacherAvatarUrl}
                      alt="头像预览"
                      className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                    />
                  </div>
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              <Input
                label="所属机构"
                placeholder="请输入所属机构（可选）"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
              />
            </CardBody>
          </Card>

          {/* 项目信息卡片 */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">项目信息</h2>
            </CardHeader>
            <Divider />
            <CardBody className="space-y-4">
              <Textarea
                label="项目简介"
                placeholder="请简要介绍项目内容和目标（可选）"
                value={projectSummary}
                onChange={(e) => setProjectSummary(e.target.value)}
                minRows={3}
                maxRows={6}
              />

              <Textarea
                label="招聘信息"
                placeholder="请详细描述招聘需求、岗位要求等（可选）"
                value={recruitmentInfo}
                onChange={(e) => setRecruitmentInfo(e.target.value)}
                minRows={4}
                maxRows={8}
              />

              <Textarea
                label="考核方式"
                placeholder="请描述考核标准和方式（可选）"
                value={assessmentMethod}
                onChange={(e) => setAssessmentMethod(e.target.value)}
                minRows={3}
                maxRows={6}
              />
            </CardBody>
          </Card>

          {/* 联系方式卡片 */}
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">联系方式</h2>
              <Button
                size="sm"
                color="primary"
                variant="flat"
                startContent={<Plus size={16} />}
                onPress={addContact}
              >
                添加联系方式
              </Button>
            </CardHeader>
            <Divider />
            <CardBody className="space-y-4">
              {contacts.map((contact, index) => (
                <div key={contact.id} className="flex gap-3 items-end">
                  <Input
                    label="联系方式类型"
                    placeholder="如：微信、邮箱、电话等"
                    value={contact.type}
                    onChange={(e) => updateContact(contact.id, 'type', e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    label="联系方式"
                    placeholder="请输入具体的联系方式"
                    value={contact.value}
                    onChange={(e) => updateContact(contact.id, 'value', e.target.value)}
                    className="flex-1"
                  />
                  {contacts.length > 1 && (
                    <Button
                      isIconOnly
                      color="danger"
                      variant="flat"
                      size="sm"
                      onPress={() => removeContact(contact.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  )}
                </div>
              ))}
            </CardBody>
          </Card>

          {/* 提交按钮 */}
          <div className="flex justify-end gap-4">
            <Button
              variant="flat"
              onPress={() => router.back()}
              disabled={loading}
            >
              取消
            </Button>
            <Button
              type="submit"
              color="primary"
              startContent={<Save size={20} />}
              isLoading={loading}
              disabled={loading}
            >
              发布招聘信息
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}