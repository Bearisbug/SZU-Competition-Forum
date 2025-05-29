'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Team {
  id: number;
  name: string;
  description: string;
  competition: string;
  status: '通过审核' | '审核中' | '未通过';
  members: number;
  maxMembers: number;
}

export default function TeamPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [competitionFilter, setCompetitionFilter] = useState<string>('');
  const [memberCountFilter, setMemberCountFilter] = useState<string>('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const teams: Team[] = [
    {
      id: 1,
      name: "XXX深圳必胜队",
      description: "深圳必胜,666",
      competition: "2017XX杯比赛",
      status: "通过审核",
      members: 5,
      maxMembers: 8
    },
    {
      id: 2,
      name: "创新之星队",
      description: "创新引领未来",
      competition: "2023创新大赛",
      status: "审核中",
      members: 3,
      maxMembers: 6
    },
    {
      id: 3,
      name: "科技先锋队",
      description: "探索科技前沿",
      competition: "全国科技竞赛",
      status: "通过审核",
      members: 4,
      maxMembers: 5
    },
    {
      id: 4,
      name: "智慧城市队",
      description: "建设智慧城市",
      competition: "2023创新大赛",
      status: "未通过",
      members: 6,
      maxMembers: 8
    },
    {
      id: 5,
      name: "未来之星队",
      description: "培养未来人才",
      competition: "青少年编程大赛",
      status: "通过审核",
      members: 2,
      maxMembers: 5
    },
  ];

  const filteredTeams = teams.filter(team => {
    const matchesSearch = 
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.competition.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCompetition = competitionFilter ? team.competition === competitionFilter : true;
    
    let matchesMemberCount = true;
    if (memberCountFilter === "1-3人") {
      matchesMemberCount = team.members <= 3;
    } else if (memberCountFilter === "4-6人") {
      matchesMemberCount = team.members >= 4 && team.members <= 6;
    } else if (memberCountFilter === "7人以上") {
      matchesMemberCount = team.members > 6;
    }
    
    return matchesSearch && matchesCompetition && matchesMemberCount;
  });

  const competitions = [...new Set(teams.map(team => team.competition))];
  
  // 处理导航点击事件
  const handleMyTeamsClick = () => {
    router.push('/communication/my-team');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-pink-900 relative">
      <button 
        onClick={handleBack}
        className="flex items-center text-blue-800 hover:text-blue-800 mb-6"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        返回上一页
      </button>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between h-16 pt-4">
          <div className="flex space-x-8">
            <div className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-900 hover:text-gray-700 hover:border-gray-300">
              <h3 className="text-2xl font-bold text-blue-900 mb-3">个人信息</h3>
            </div>
            <div className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-900 hover:text-gray-700 hover:border-gray-300">
              <h3 className="text-2xl font-bold text-blue-900 mb-3">创建队伍</h3>
            </div>
            <div 
              className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-900 hover:text-gray-700 hover:border-gray-300 cursor-pointer"
              onClick={handleMyTeamsClick}
            >
              <h3 className="text-2xl font-bold text-blue-900 mb-3">我的队伍</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">队伍列表</h1>
          <div className="mt-2 flex items-center text-gray-500">
            <div className="w-12 h-1 bg-blue-800 mr-2"></div>
            <span>找到适合您的团队，一起参与竞赛</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="搜索关键词"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center">
                <label className="mr-2 text-gray-700">比赛名称</label>
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={competitionFilter}
                  onChange={(e) => setCompetitionFilter(e.target.value)}
                >
                  <option value="">全部</option>
                  {competitions.map((comp, index) => (
                    <option key={index} value={comp}>{comp}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center">
                <label className="mr-2 text-gray-700">人数</label>
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={memberCountFilter}
                  onChange={(e) => setMemberCountFilter(e.target.value)}
                >
                  <option value="">全部</option>
                  <option value="1-3人">1-3人</option>
                  <option value="4-6人">4-6人</option>
                  <option value="7人以上">7人以上</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    队伍名称
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    队伍简介
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    比赛名称
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    队伍状态
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTeams.length > 0 ? (
                  filteredTeams.map((team) => (
                    <tr key={team.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{team.name}</div>
                        <div className="text-sm text-gray-500">
                          {team.members}/{team.maxMembers}人
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">{team.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {team.competition}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${team.status === '通过审核' ? 'bg-green-100 text-green-800' : 
                            team.status === '审核中' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'}`}>
                          {team.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          className="text-blue-600 hover:text-blue-900 mr-3"
                          onClick={() => router.push(`/team/${team.id}`)}
                        >
                          查看
                        </button>
                        <button 
                          className="text-green-600 hover:text-green-900"
                          onClick={() => router.push(`/join-team/${team.id}`)}
                        >
                          加入
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      没有找到匹配的队伍
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-700">
            显示 <span className="font-medium">1</span> 到 <span className="font-medium">{filteredTeams.length}</span> 条，共 <span className="font-medium">{filteredTeams.length}</span> 条
          </div>
          <div className="flex space-x-2">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              上一页
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              下一页
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button 
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => router.push('/create-team')}
          >
            创建新队伍
          </button>
        </div>
      </div>
    </div>
  );
}