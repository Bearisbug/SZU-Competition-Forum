'use client';

import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import React, { useState, useEffect } from "react";
import {
  Button,
  Tabs,
  Tab,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Textarea,
  Accordion,
  AccordionItem,
  Card,
  CardHeader,
  CardBody,
  Spinner,
  Tooltip,
} from "@heroui/react";
import toast from "react-hot-toast";
import Image from "next/image";
import { TeamSelectionModal } from "@/components/Modal/TeamSelectionModal";
import { Trash2, Plus, ArrowLeft, Trophy, Calendar, Users, Info, Megaphone, PlusCircle } from 'lucide-react';
import { API_BASE_URL } from "@/CONFIG";

// 竞赛数据类型定义
interface CompetitionDetail {
  id: string;
  title: string;
  publishDate: string;
  views: string;
  type: string;
  materials: {
    title: string;
    description: string;
    link: string;
  }[];
  info: {
    time: string[];
    qualification: string[];
    awards: string[];
  };
  notices: {
    title: string;
    date: string;
    content: string;
  }[];
  news: {
    title: string;
    date: string;
    image: string;
  }[];
  faq: {
    question: string;
    answer: string;
  }[];
  teamInfo?: {
    teamName: string;
    captain: string;
    members: string[];
  };
}

// 模拟数据源 - 实际项目中应该从API获取
const competitionData: Record<string, CompetitionDetail> = {
  '1': {
    id: '1',
    title: '第九届中国国际“互联网+”大学生创新创业大赛',
    publishDate: '2023-05-29',
    views: '2.4k',
    type: 'I类',
    materials: [
      {
        title: '创新创业大赛官方资料',
        description: '获取2025年创新创业大赛的官方学习资料和参赛指南',
        link: '#'
      }
    ],
    info: {
      time: [
        '报名时间：2023年5月29日 - 2023年8月15日',
        '初赛时间：2023年6月-8月',
        '决赛时间：2023年9月-10月'
      ],
      qualification: [
        '全国高等院校全日制在校大学生均可报名',
        '团队人数限制：3-5人',
        '需提交完整的商业计划书'
      ],
      awards: [
        '金奖',
        '银奖',
        '铜奖'
      ]
    },
    notices: [
      {
        title: '暂无',
        date: '无',
        content: '无'
      }
    ],
    news: [
      {
        title: '暂无',
        date: '无',
        image: '/images/b.jpg'
      }
    ],
    faq: [
      {
        question: 'Q: 可以跨校组队吗？',
        answer: 'A: 可以，团队可以包含不同学校的学生，但需指定一个主申报学校。'
      }
    ]
  },
  '2': {
    id: '2',
    title: '【挑战杯】第十九届“挑战杯”全国大学生课外学术科技作品竞赛“人工智能+”专项赛',
    publishDate: '2025-03-27',
    views: '1.8k',
    type: 'I类',
    materials: [
      {
        title: '科技作品竞赛指南',
        description: '2025年挑战杯科技作品竞赛的参赛指南和技术规范',
        link: '#'
      }
    ],
    info: {
      time: [
        '报名时间：2025年3月27日 - 2025年6月1日',
        '2025年7月15日前完成国赛推报工作',
        '7月中下旬至9月上旬，组织国赛初审。终审决赛与主体赛全国终审决赛一并开展评审。'
      ],
      qualification: [
        '2025年6月1日以前正式注册的国内全日制非成人教育的各类高等院校在校专科生、本科生、硕士研究生和博士研究生(均不含在职研究生)均可申报作品参赛，以个人或团队形式参赛均可，每个团队不超过10人(含作品申报者)，每件作品可由不超过3名教师指导完成。按照学历最高的参赛成员划分至专科组、本科组、硕士组和博士组分开评审。可以跨专业、跨校、跨地域组队。参赛人员年龄在40周岁以下，即1985年6月1日(含)以后出生。本校硕博连读生(直博生)若在2025年6月1日以前未通过博士资格考试的，按硕士生学历申报作品，若通过，则按博士生学历申报作品。没有实行资格考试制度的学校，按照前两年为硕士、后续为博士学历申报作品。本硕博连读生，按照四年、二年及后续分别对应本、硕、博申报。鼓励支持中外青年联合组队参赛。除上述参赛人员范围外，还主要包括具有国外普通高等院校学籍的在读学生(主要指有国外学籍的外籍学生及中国籍海外留学生)和具有外国国籍、国内普通高等院校学籍的全日制非成人教育在读学生(主要指外籍来华留学生)。相关要求参照上述内容。'
      ],
      awards: [
        '根据作品报送情况，评选出若干优秀作品予以激励。优秀作品中，特等奖作品不超过10%、一等奖作品不超过20%、二等奖作品不超过30%，其余为三等奖作品。',
        '该专项赛组织开展情况将作为本届竞赛高校优秀组织奖评选评价重要因素。对组织学生参赛范围广、工作力度大、作品质量高的学校，组委会将通过组织典型选树、寻访活动、宣讲交流等方式，对省级团委和高校予以宣传表扬。'
      ]
    },
    notices: [
      {
        title: '暂时没有相关通知公告~',
        date: '无',
        content: '无'
      }
    ],
    news: [
      {
        title: '暂时没有相关新闻动态~',
        date: '无',
        image: '/images/a.jpg'
      }
    ],
    faq: [
      {
        question: 'Q: 作品可以多人合作吗？',
        answer: 'A: 可以，但需明确每个成员的分工和贡献。'
      }
    ]
  },
  '3': {
    id: '3',
    title: '第十四届“挑战杯”中国大学生创业计划竞赛',
    publishDate: '204-03-19',
    views: '1.8k',
    type: 'I类',
    materials: [
      {
        title: '科技作品竞赛指南',
        description: '2025年挑战杯科技作品竞赛的参赛指南和技术规范',
        link: '#'
      }
    ],
    info: {
      time: [
        '报名时间：2024年3月19日 - 2024年6月1日'
      ],
      qualification: [
        '面向普通高校学生和职业院校学生进行竞赛评选'
      ],
      awards: [
        '竞赛设项目金奖、银奖、铜奖，由全国组委会组织专家进行评定。设学校集体奖（挑战杯、优胜杯），按所推报项目获奖名次赋分，核算团体总分后评定，如遇团体总分相同情况，则同时授予团体总分相同学校相应奖项。综合组织动员、活动参与、竞赛获奖等情况，对表现优秀的部分省份、学校、组织者予以通报表扬。'
      ]
    },
    notices: [
      {
        title: '暂无',
        date: '无',
        content: '无'
      }
    ],
    news: [
      {
        title: '暂无',
        date: '无',
        image: '/images/tzbcy.png'
      }
    ],
    faq: [
      {
        question: 'Q: 作品可以多人合作吗？',
        answer: 'A: 可以，但需明确每个成员的分工和贡献。'
      }
    ]
  },
  '4': {
    id: '4',
    title: '第十六届蓝桥杯全国软件和信息技术专业人才大赛',
    publishDate: '2024-10-08',
    views: '3.1k',
    type: 'III类',
    materials: [
      {
        title: '编程竞赛学习资料',
        description: '蓝桥杯竞赛的编程题库和历年真题',
        link: '#'
      },
      {
        title: '竞赛环境说明',
        description: '比赛使用的编程环境和工具说明',
        link: '#'
      }
    ],
    info: {
      time: [
        '报名时间：2024年10月08日 - 2025年4月25日',
        '省赛时间：2025年4月',
        '全国总决赛：2025年6月中上旬'
      ],
      qualification: [
        '具有正式全日制学籍且符合相关科目报名要求的研究生',
        '本科生及高职高专学生(以报名时状态为准)'
      ],
      awards: [
        '全国一等奖',
        '全国二等奖',
        '全国三等奖',
        '优秀奖'
      ]
    },
    notices: [
      {
        title: '暂无',
        date: '无',
        content: '无'
      }
    ],
    news: [
      {
        title: '暂无',
        date: '无',
        image: '/images/lqb.png'
      }
    ],
    faq: [
      {
        question: 'Q: 可以使用哪些编程语言？',
        answer: 'A: 支持Java, C/C++, Python等主流编程语言。'
      }
    ]
  },
  '5': {
    id: '5',
    title: '2025年“DigitalCup” 全国大学生数学建模大赛',
    publishDate: '2025-04-28',
    views: '1.8k',
    type: 'II类',
    materials: [
      {
        title: '科技作品竞赛指南',
        description: '2025年全国大学生数学建竞赛的参赛指南和技术规范',
        link: '#'
      }
    ],
    info: {
      time: [
        '报名时间：2025年4月28日 - 2025年6月21日',
        '初赛时间：2025年5月 - 8月',
        '决赛展示：2025年7月 - 9月'
      ],
      qualification: [
        '专业组别：适合于数学专业相关学生报名',
        '非专业组别：适合于其他专业学生报名'
      ],
      awards: [
        '一等奖：电子版 + 纸质版证书',
        '二等奖：电子版 + 纸质版证书',
        '三等奖：电子版 + 纸质版证书',
        '优秀奖：电子版 + 纸质版证书'
      ]
    },
    notices: [
      {
        title: '【DigitalCup数学建模大赛】官方通知文件',
        date: '2025-04-25',
        content: '...'
      }
    ],
    news: [
      {
        title: '【DigitalCup数学建模大赛】数学建模介绍',
        date: '2025-04-25',
        image: '/images/sj.png'
      }
    ],
    faq: [
      {
        question: 'Q: 作品可以多人合作吗？',
        answer: 'A: 可以，但需明确每个成员的分工和贡献。'
      }
    ]
  },
  '6': {
    id: '6',
    title: '2025年全国大学生电子设计竞赛',
    publishDate: '2025-01-17',
    views: '1.8k',
    type: 'II类',
    materials: [
      {
        title: '科技作品竞赛指南',
        description: '2025年全国大学生电子设计竞赛的参赛指南和技术规范',
        link: '#'
      }
    ],
    info: {
      time: [
        '报名时间：2025年1月17日 - 2025年5月31日',
        '竞赛时间：2025年7月30日8：00至8月2日20：00'
      ],
      qualification: [
        '全日制在校本科生、研究生'
      ],
      awards: [
        '一等奖',
        '二等奖',
        '三等奖'
      ]
    },
    notices: [
      {
        title: '暂无',
        date: '无',
        content: '无'
      }
    ],
    news: [
      {
        title: '暂无',
        date: '无',
        image: '/images/dzsj.png'
      }
    ],
    faq: [
      {
        question: 'Q: 作品可以多人合作吗？',
        answer: 'A: 可以，但需明确每个成员的分工和贡献。'
      }
    ]
  }
};

export default function PostDetailPage() {
  const router = useRouter();
  const params = useParams() as { id: string };
  const [activeTab, setActiveTab] = useState('参赛信息');
  const [competition, setCompetition] = useState<CompetitionDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // 根据ID获取竞赛数据
  useEffect(() => {
    // 模拟API请求
    const fetchData = () => {
      setTimeout(() => {
        const data = competitionData[params.id];
        if (data) {
          setCompetition(data);
        } else {
          // 处理找不到竞赛的情况
          console.error(`未找到ID为${params.id}的竞赛`);
        }
        setLoading(false);
      }, 300);
    };

    fetchData();
  }, [params.id]);

  // 渲染当前选项卡内容
  const renderTabContent = () => {
    if (!competition) return null;
    
    switch(activeTab) {
      case '参赛信息':
        return (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">参赛信息</h2>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-bold text-blue-700">竞赛时间</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  {competition.info.time.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-bold text-green-700">参赛资格</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  {competition.info.qualification.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-bold text-yellow-700">奖项设置</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  {competition.info.awards.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      case '通知公告':
        return (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">通知公告</h2>
            <div className="space-y-3">
              {competition.notices.map((notice, index) => (
                <div key={index} className="border-b pb-3">
                  <h3 className="font-bold">{notice.title}</h3>
                  <p className="text-sm text-gray-500">{notice.date}</p>
                  <p className="mt-1">{notice.content}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case '新闻动态':
        return (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">新闻动态</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {competition.news.map((item, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <div 
                    className="h-40 bg-cover bg-center"
                    style={{ backgroundImage: `url('${item.image}')` }}
                  ></div>
                  <div className="p-3">
                    <h3 className="font-bold">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case '参赛咨询':
        return (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">参赛咨询</h2>
            <div className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-bold text-purple-700">常见问题</h3>
                <div className="space-y-2">
                  {competition.faq.map((item, index) => (
                    <div key={index}>
                      <h4 className="font-medium">{item.question}</h4>
                      <p>{item.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case '团队管理':
        return (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">团队管理</h2>
            <div className="space-y-4">
              {competition.teamInfo ? (
                <>
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-bold">我的团队</h3>
                      <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
                        管理团队
                      </button>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-lg">🏆</span>
                      </div>
                      <div>
                        <p className="font-bold">{competition.teamInfo.teamName}</p>
                        <p className="text-sm text-gray-500">队长：{competition.teamInfo.captain}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">团队成员</h4>
                      <ul className="space-y-2">
                        {competition.teamInfo.members.map((member, index) => (
                          <li key={index} className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-gray-200 mr-2 flex items-center justify-center">
                              <span className="text-xs">👤</span>
                            </div>
                            {member}{index === 0 ? '（队长）' : ''}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="font-bold text-yellow-700">团队操作</h3>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <button className="bg-blue-600 text-white py-2 rounded">
                        邀请成员
                      </button>
                      <button className="bg-gray-200 py-2 rounded">
                        解散团队
                      </button>
                      <button className="bg-green-600 text-white py-2 rounded">
                        提交作品
                      </button>
                      <button className="bg-gray-200 py-2 rounded">
                        退出团队
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="mb-4">您尚未创建或加入任何团队</p>
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg">
                    创建新团队
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      default:
        return <div className="p-4">请选择导航项查看内容</div>;
    }
  };

  if (loading) {
    return (
      <div className="bg-cover bg-center bg-no-repeat relative overflow-hidden min-h-[900px] w-full flex items-center justify-center"
        style={{backgroundImage: "url('/images/e.png')"}}>
        <div className="absolute inset-0 bg-red-900 bg-opacity-30 z-0"></div>
        <div className="text-white text-xl z-10">加载中...</div>
      </div>
    );
  }

  if (!competition) {
    return (
      <div className="bg-cover bg-center bg-no-repeat relative overflow-hidden min-h-[900px] w-full flex items-center justify-center"
        style={{backgroundImage: "url('/images/e.png')"}}>
        <div className="absolute inset-0 bg-red-900 bg-opacity-30 z-0"></div>
        <div className="text-center z-10">
          <h1 className="text-2xl font-bold text-white mb-4">未找到竞赛信息</h1>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-white text-red-800 rounded-lg"
          >
            返回列表
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cover bg-center bg-no-repeat relative overflow-hidden min-h-[900px] w-full"
        style={{backgroundImage: "url('/images/e.png')"}}>
      
      {/* 红色蒙层 */}
      <div className="absolute inset-0 bg-red-900 bg-opacity-30 z-0"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center text-white hover:text-gray-200"
        >
          <svg
            className="w-5 h-5 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          返回列表
        </button>
        
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          {/* 顶部导航栏 */}
          <div className="flex flex-wrap border-b">
            {['参赛信息', '通知公告', '新闻动态', '参赛咨询', '团队管理'].map(tab => (
              <button
                key={tab}
                className={`px-4 py-3 font-medium text-sm md:text-base transition-colors ${
                  activeTab === tab 
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                    : 'text-gray-600 hover:text-blue-500 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          
          {/* 帖子标题区域 */}
          <div className="p-6 border-b">
            <div className="flex items-start">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {competition.title}
                </h1>
                <div className="flex items-center text-sm text-gray-500">
                  <span>发布时间：{competition.publishDate}</span>
                  <span className="mx-2">|</span>
                  <span>浏览：{competition.views}</span>
                </div>
              </div>
              <span className={`text-sm px-3 py-1 rounded-full ${
                competition.type === 'I类' ? 'bg-blue-600' : 
                competition.type === 'II类' ? 'bg-green-600' : 
                'bg-purple-600'
              } text-white`}>
                {competition.type}
              </span>
            </div>
          </div>
          
          {/* 内容区域 */}
          <div className="overflow-y-auto" style={{ maxHeight: '500px' }}>
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}