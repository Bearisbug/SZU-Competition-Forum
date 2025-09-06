'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Spinner, Input } from '@heroui/react';
import { Plus, Search } from 'lucide-react';
import { useAuthStore, withAuth } from '@/lib/auth-guards';
import RecruitmentCard, { Recruitment } from '@/components/Card/RecruitmentCard';
import { API_BASE_URL } from '@/CONFIG';
import toast from 'react-hot-toast';

function RecruitmentPageContent() {
  const router = useRouter();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [role, setRole] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const isAdmin = (role || "").toLowerCase() === "admin";
  const isTeacher = (role || "").toLowerCase() === "teacher";
  const canCreateRecruitment = isAdmin || isTeacher;
  
  const [recruitments, setRecruitments] = useState<Recruitment[]>([]);
  const [filteredRecruitments, setFilteredRecruitments] = useState<Recruitment[]>([]);
  const [selectedInstitution, setSelectedInstitution] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 获取用户角色
  const fetchMyRole = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setRole(null);
      return;
    }
    
    function parseJwt(token: string) {
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        return JSON.parse(jsonPayload);
      } catch {
        return null;
      }
    }

    const payload = parseJwt(token);
    const uid = payload?.sub;
    if (!uid) {
      setRole(null);
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/user/info/${uid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const user = await res.json();
        setRole(user?.role ?? null);
        setCurrentUserId(user?.id ?? null);
      } else {
        setRole(null);
        setCurrentUserId(null);
      }
    } catch {
      setRole(null);
      setCurrentUserId(null);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchMyRole();
    }
  }, [fetchMyRole, isLoggedIn]);

  // 获取招聘信息列表
  const fetchRecruitments = useCallback(async () => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/api/recruitments/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('获取招聘信息失败');
      }

      const data = await response.json();
      setRecruitments(data);
      setFilteredRecruitments(data);
    } catch (error) {
      console.error('获取招聘信息错误:', error);
      toast.error('获取招聘信息失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    fetchRecruitments();
  }, [fetchRecruitments]);

  // 筛选功能 - 支持搜索和机构筛选
  useEffect(() => {
    let filtered = recruitments;
    
    // 按机构筛选
    if (selectedInstitution) {
      filtered = filtered.filter(recruitment => 
        recruitment.institution === selectedInstitution
      );
    }
    
    // 按老师姓名搜索
    if (searchQuery.trim()) {
      filtered = filtered.filter(recruitment =>
        recruitment.teacher_name.toLowerCase().includes(searchQuery.toLowerCase().trim())
      );
    }
    
    setFilteredRecruitments(filtered);
  }, [recruitments, selectedInstitution, searchQuery]);

  // 处理机构筛选
  const handleInstitutionFilter = (institution: string | null) => {
    setSelectedInstitution(institution);
  };

  // 重置筛选
  const resetFilters = () => {
    setSelectedInstitution(null);
    setSearchQuery('');
  };

  // 处理编辑
  const handleEdit = (id: number) => {
    router.push(`/recruitment/${id}/edit`);
  };

  // 处理删除
  const handleDelete = async (id: number) => {
    if (!window.confirm('确定要删除这条招聘信息吗？此操作不可撤销。')) {
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/api/recruitments/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('删除失败');
      }

      setRecruitments(prev => prev.filter(r => r.id !== id));
      toast.success('招聘信息已删除');
    } catch (error) {
      console.error('删除招聘信息错误:', error);
      toast.error('删除失败，请稍后重试');
    }
  };

  // 创建新招聘信息
  const handleCreate = () => {
    router.push('/recruitment/create');
  };

  // 如果未挂载，显示加载状态
  if (!mounted) {
    return (
      <div 
        className="min-h-screen bg-gray-50 flex items-center justify-center"
        style={{ paddingTop: "60px" }}
      >
        <Spinner size="lg" />
      </div>
    );
  }

  // 如果未登录，显示提示信息
  if (!isLoggedIn) {
    return (
      <div 
        className="min-h-screen bg-gray-50 flex items-center justify-center"
        style={{ paddingTop: "60px" }}
      >
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <div className="text-xl text-gray-500 mb-4">请先登录</div>
          <p className="text-gray-400 mb-6">您需要登录后才能查看招聘信息</p>
          <Button color="primary" onPress={() => router.push('/')}>
            返回首页
          </Button>
        </div>
      </div>
    );
  }

  // 如果正在加载，显示加载状态
  if (loading) {
    return (
      <div 
        className="min-h-screen bg-gray-50 flex items-center justify-center"
        style={{ paddingTop: mounted ? (isLoggedIn ? "114px" : "60px") : "60px" }}
      >
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gray-50"
      style={{ paddingTop: mounted ? (isLoggedIn ? "114px" : "60px") : "60px" }}
    >
      <div className="max-w-7xl mx-auto p-4">
        {/* 顶部标题栏 */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">招聘信息</h1>
          {canCreateRecruitment && (
            <Button
              color="primary"
              size="lg"
              startContent={<Plus size={20} />}
              onPress={handleCreate}
            >
              发布招聘信息
            </Button>
          )}
        </div>

        {/* 主要内容区 */}
        <div className="flex gap-6">
          {/* 左侧筛选栏 */}
          <div className="w-80 flex-shrink-0">
            {/* 搜索框 */}
            <div className="mb-4">
              <Input
                placeholder="搜索老师姓名..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                startContent={<Search size={18} className="text-gray-400" />}
                classNames={{
                  input: "text-sm",
                  inputWrapper: "bg-white shadow-md border-gray-200"
                }}
              />
            </div>
            
            <div className="bg-gradient-to-b from-blue-800 to-blue-900 text-white rounded-2xl shadow-xl p-6 sticky top-20">
              <div className="flex justify-between items-center mb-6 pb-3 border-b-2 border-white/30">
                <h2 className="text-xl font-bold">筛选条件</h2>
                {(selectedInstitution || searchQuery.trim()) && (
                  <button
                    onClick={resetFilters}
                    className="text-sm bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg transition-colors duration-200"
                  >
                    重置筛选
                  </button>
                )}
              </div>

              {/* 机构筛选 */}
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-3 flex items-center text-blue-200">
                  <div className="w-3 h-3 rounded-full bg-blue-300 mr-2"></div>
                  按机构筛选
                </h3>
                <ul className="space-y-2 ml-5">
                  <li>
                    <button
                      className={`w-full text-left py-2 px-3 rounded-lg transition-all duration-200 text-sm ${
                        selectedInstitution === null
                          ? "bg-pink-600 text-white shadow-md"
                          : "bg-blue-700/40 hover:bg-pink-600/80 hover:text-white"
                      }`}
                      onClick={() => handleInstitutionFilter(null)}
                    >
                      全部机构
                    </button>
                  </li>
                  <li>
                    <button
                      className={`w-full text-left py-2 px-3 rounded-lg transition-all duration-200 text-sm ${
                        selectedInstitution === "大数据研究所"
                          ? "bg-pink-600 text-white shadow-md"
                          : "bg-blue-700/40 hover:bg-pink-600/80 hover:text-white"
                      }`}
                      onClick={() => handleInstitutionFilter("大数据研究所")}
                    >
                      大数据研究所
                    </button>
                  </li>
                  <li>
                    <button
                      className={`w-full text-left py-2 px-3 rounded-lg transition-all duration-200 text-sm ${
                        selectedInstitution === "可视化计算研究所"
                          ? "bg-pink-600 text-white shadow-md"
                          : "bg-blue-700/40 hover:bg-pink-600/80 hover:text-white"
                      }`}
                      onClick={() => handleInstitutionFilter("可视化计算研究所")}
                    >
                      可视化计算研究所
                    </button>
                  </li>
                </ul>
              </div>

              {/* 项目类型筛选 */}
              <div className="mb-4">
                <h3 className="text-lg font-bold mb-3 flex items-center text-blue-200">
                  <div className="w-3 h-3 rounded-full bg-blue-400 mr-2"></div>
                  按项目类型筛选
                </h3>
                <div className="ml-5 text-center py-3 text-blue-200 text-sm bg-blue-700/20 rounded-lg">
                  <p>筛选功能即将上线</p>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧内容区 */}
          <div className="flex-1 min-w-0 min-h-screen">
            {/* 筛选状态显示 */}
            {(selectedInstitution || searchQuery.trim()) && (
              <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg flex items-center justify-between">
                <div className="flex items-center flex-wrap gap-2">
                  <span className="text-sm">当前筛选: </span>
                  {selectedInstitution && (
                    <span className="font-semibold px-2 py-1 bg-blue-100 rounded text-sm">
                      机构: {selectedInstitution}
                    </span>
                  )}
                  {searchQuery.trim() && (
                    <span className="font-semibold px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                      搜索: {searchQuery.trim()}
                    </span>
                  )}
                </div>
                <button
                  onClick={resetFilters}
                  className="text-sm bg-blue-200 hover:bg-blue-300 px-3 py-1 rounded-lg transition-colors duration-200"
                >
                  清除筛选
                </button>
              </div>
            )}

            {filteredRecruitments.length === 0 ? (
              <div className="text-center py-16 min-h-96">
                <div className="text-6xl mb-4">📋</div>
                <div className="text-xl text-gray-500 mb-4">
                  {selectedInstitution ? `${selectedInstitution}暂无招聘信息` : '暂无招聘信息'}
                </div>
                <p className="text-gray-400 mb-6">
                  {selectedInstitution 
                    ? '尝试选择其他机构或清除筛选条件'
                    : (canCreateRecruitment ? '点击右上角按钮发布第一条招聘信息' : '请等待管理员或教师发布招聘信息')
                  }
                </p>
                {!selectedInstitution && canCreateRecruitment && (
                  <Button
                    color="primary"
                    size="lg"
                    startContent={<Plus size={20} />}
                    onPress={handleCreate}
                  >
                    发布招聘信息
                  </Button>
                )}
                {selectedInstitution && (
                  <Button
                    color="primary"
                    variant="flat"
                    onPress={resetFilters}
                  >
                    查看所有招聘信息
                  </Button>
                )}
              </div>
            ) : (
              /* 招聘信息卡片网格 - 瀑布流布局 */
              <div className="columns-1 lg:columns-2 gap-6 space-y-6 min-h-screen">
                {filteredRecruitments.map((recruitment) => (
                  <div key={recruitment.id} className="break-inside-avoid">
                    <RecruitmentCard
                      recruitment={recruitment}
                      currentUserId={currentUserId ?? undefined}
                      currentUserRole={role ?? undefined}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 使用登录校验高阶组件包装原始组件
const RecruitmentPage = withAuth(RecruitmentPageContent);
export default RecruitmentPage;