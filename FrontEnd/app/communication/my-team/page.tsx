'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MyTeamPage() {
  const router = useRouter();
  const [teamName, setTeamName] = useState('创新之星队');
  const [teamDescription, setTeamDescription] = useState('我们是一支专注于科技创新与竞赛的团队，致力于解决实际问题');
  const [competition, setCompetition] = useState('2023全国科技创新大赛');
  const [members, setMembers] = useState([
    { id: 1, name: '何子棋', role: '队长', joined: true },
    { id: 2, name: '李华', role: '队员', joined: true },
    { id: 3, name: '王明', role: '队员', joined: false },
    { id: 4, name: '张伟', role: '队员', joined: false },
  ]);

  const handleBack = () => {
    router.back();
  };

  const handleJoin = (id: number) => {
    setMembers(members.map(member => 
      member.id === id ? {...member, joined: true} : member
    ));
  };

  const handleRemove = (id: number) => {
    setMembers(members.filter(member => member.id !== id));
  };

  const handleAddMember = () => {
    const newMemberId = members.length > 0 ? Math.max(...members.map(m => m.id)) + 1 : 1;
    setMembers([...members, { 
      id: newMemberId, 
      name: '新成员', 
      role: '队员', 
      joined: false 
    }]);
  };

  const handleSaveTeamInfo = () => {
    // 这里可以添加保存队伍信息的逻辑
    alert('队伍信息已保存！');
  };

  return (
    <div className="min-h-screen bg-pink-900 to-indigo-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 返回按钮 */}
        <button 
          onClick={handleBack}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          返回上一页
        </button>

        {/* 页面标题 */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">我的队伍</h1>
        </div>

        {/* 队长描述 */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <p className="text-gray-700 leading-relaxed">
            <span className="font-semibold text-blue-600">队长</span>作为队伍的负责人，负责本队的组织和任务工作。可完成组织活动、报告截止时间等活动，解决队友困难。
          </p>
        </div>

        {/* 成员列表 */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">成员管理</h2>
          </div>
          
          <div className="divide-y divide-gray-100">
            {members.map((member) => (
              <div key={member.id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center mr-4">
                    <span className="text-gray-500 font-bold">{member.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">
                      {member.name} 
                      {member.role === '队长' && (
                        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">队长</span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {member.joined ? (
                        <span className="flex items-center text-green-600">
                          <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                          E加入
                        </span>
                      ) : (
                        <span className="text-gray-500">等待加入</span>
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    查看详情
                  </button>
                  {!member.joined && (
                    <button 
                      onClick={() => handleJoin(member.id)}
                      className="text-green-600 hover:text-green-800 text-sm font-medium"
                    >
                      加入
                    </button>
                  )}
                  {member.role !== '队长' && (
                    <button 
                      onClick={() => handleRemove(member.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      删除
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="px-6 py-4 border-t border-gray-200">
            <button 
              onClick={handleAddMember}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              添加队友
            </button>
          </div>
        </div>

        {/* 队伍信息 */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">队伍信息</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  队伍名称
                </label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  所属比赛
                </label>
                <input
                  type="text"
                  value={competition}
                  onChange={(e) => setCompetition(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  队伍简介
                </label>
                <textarea
                  value={teamDescription}
                  onChange={(e) => setTeamDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleSaveTeamInfo}
                className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-md"
              >
                保存队伍信息
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}