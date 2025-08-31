'use client';

import React from 'react';
import { ArticleCard } from '@/components/Card/ArticleCard';
import CompetitionCard from '@/components/Card/CompetitionCard';
import RecruitmentCard from '@/components/Card/RecruitmentCard';
import { TeamCard } from '@/components/Card/TeamCard';
import type { Competition } from '@/components/Card/CompetitionCard';
import type { Recruitment } from '@/components/Card/RecruitmentCard';
import type { Team, TeamMember } from '@/components/Card/TeamCard';

export default function TestPage() {
  // Mock data for ArticleCard
  const mockArticle = {
    id: 1,
    title: "Advanced Machine Learning Techniques for Competition Success",
    summary: "Explore cutting-edge machine learning algorithms and their applications in competitive programming and data science competitions. This comprehensive guide covers neural networks, ensemble methods, and optimization strategies.",
    category: "Machine Learning",
    cover_image: "/images/ml-competition.jpg",
    view_count: 1250,
    created_at: "2024-01-15T10:30:00Z",
    isAuthor: true,
    isAdmin: false,
  };

  // Mock data for CompetitionCard
  const mockCompetition: Competition = {
    id: 1,
    name: "International Collegiate Programming Contest (ICPC)",
    sign_up_start_time: new Date("2024-02-01"),
    sign_up_end_time: new Date("2024-02-28"),
    competition_start_time: new Date("2024-03-15"),
    competition_end_time: new Date("2024-03-16"),
    details: "The ICPC is the premier global programming competition conducted by and for the world's universities. Teams of three students represent their university and work to solve complex algorithmic problems under time pressure.",
    organizer: "ICPC Foundation",
    competition_type: "Programming",
    competition_level: "International Level I",
    competition_subtype: "Algorithm Design",
    cover_image: "/images/icpc-banner.jpg",
    created_at: new Date("2024-01-10"),
    updated_at: new Date("2024-01-20"),
  };

  // Mock data for RecruitmentCard
  const mockRecruitment: Recruitment = {
    id: 1,
    card_id: "REC-2024-001",
    teacher_name: "Dr. Sarah Johnson",
    teacher_avatar_url: "/images/teacher-avatar.jpg",
    institution: "Computer Science Department, MIT",
    project_summary: "We are seeking talented undergraduate students to join our research team focusing on artificial intelligence and machine learning applications in competitive programming. This project involves developing novel algorithms for optimization problems and participating in international programming contests.",
    recruitment_info: "Looking for 3-4 motivated students with strong programming skills in C++/Python and solid mathematical background. Previous competition experience preferred but not required. Students will receive mentorship, training, and opportunities to participate in prestigious competitions like ICPC and Google Code Jam.",
    assessment_method: "Initial screening through coding assessment, followed by technical interview covering algorithms, data structures, and problem-solving approaches. Final selection based on team compatibility and commitment level.",
    contacts: {
      "Email": "sarah.johnson@mit.edu",
      "Office": "Room 32-G882, Stata Center",
      "Phone": "+1 (617) 253-5851",
      "Office Hours": "Tuesdays & Thursdays 2-4 PM"
    },
    created_at: "2024-01-12T14:20:00Z",
    updated_at: "2024-01-18T09:15:00Z",
  };

  // Mock data for TeamCard
  const mockTeam: Team = {
    id: 1,
    name: "Algorithm Masters",
    description: "A competitive programming team focused on mastering advanced algorithms and data structures. We participate in various programming contests including ICPC, Codeforces, and AtCoder competitions.",
    goals: "To achieve top rankings in international programming competitions and develop innovative algorithmic solutions for complex computational problems.",
    requirements: [
      "Strong proficiency in C++ or Java",
      "Solid understanding of algorithms and data structures",
      "Previous competitive programming experience",
      "Commitment to regular practice and team meetings",
      "Ability to work under pressure during contests"
    ],
    max_members: 5,
    members: []
  };

  const mockMembers: TeamMember[] = [
    {
      id: 1,
      team_id: 1,
      user_id: 101,
      name: "Alex Chen",
      role: "Team Captain",
      position: "Algorithm Specialist",
      major: "Computer Science",
      avatarUrl: "/images/alex-avatar.jpg",
      status: 1
    },
    {
      id: 2,
      team_id: 1,
      user_id: 102,
      name: "Emma Rodriguez",
      role: "Vice Captain",
      position: "Data Structure Expert",
      major: "Software Engineering",
      avatarUrl: "/images/emma-avatar.jpg",
      status: 1
    },
    {
      id: 3,
      team_id: 1,
      user_id: 103,
      name: "Michael Kim",
      role: "Member",
      position: "Mathematics Specialist",
      major: "Applied Mathematics",
      avatarUrl: "/images/michael-avatar.jpg",
      status: 1
    },
    {
      id: 4,
      team_id: 1,
      user_id: 104,
      name: "Sophie Zhang",
      role: "Member",
      position: "Problem Solver",
      major: "Computer Science",
      avatarUrl: "/images/sophie-avatar.jpg",
      status: 1
    }
  ];

  // Mock handlers for TeamCard
  const handleJoinTeam = async (teamId: number, reason: string) => {
    console.log(`Joining team ${teamId} with reason: ${reason}`);
  };

  const handleLeaveTeam = async (teamId: number) => {
    console.log(`Leaving team ${teamId}`);
  };

  const handleUpdateTeam = async (teamId: number, data: Partial<Team>) => {
    console.log(`Updating team ${teamId}:`, data);
  };

  const handleDisbandTeam = async (teamId: number) => {
    console.log(`Disbanding team ${teamId}`);
  };

  const handleRemoveMember = async (teamId: number, memberId: number) => {
    console.log(`Removing member ${memberId} from team ${teamId}`);
  };

  const handleCompetitionClick = (id: number) => {
    console.log(`Clicked competition ${id}`);
  };

  const handleCompetitionDelete = (id: number) => {
    console.log(`Deleting competition ${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Card Components Showcase
          </h1>
          <p className="text-xl text-gray-600">
            Demonstration of four different card styles with mock data
          </p>
        </div>

        <div className="space-y-16">
          {/* Article Card Section */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Article Card
            </h2>
            <div className="max-w-md">
              <ArticleCard {...mockArticle} />
            </div>
          </section>

          {/* Competition Card Section */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Competition Card
            </h2>
            <div className="max-w-md">
              <CompetitionCard
                competition={mockCompetition}
                isAdmin={true}
                onDelete={handleCompetitionDelete}
                onClick={handleCompetitionClick}
              />
            </div>
          </section>

          {/* Recruitment Card Section */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Recruitment Card
            </h2>
            <div className="max-w-md">
              <RecruitmentCard
                recruitment={mockRecruitment}
                isAdmin={true}
                onEdit={(id) => console.log(`Editing recruitment ${id}`)}
                onDelete={(id) => console.log(`Deleting recruitment ${id}`)}
              />
            </div>
          </section>

          {/* Team Card Section */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Team Card
            </h2>
            <div className="max-w-2xl">
              <TeamCard
                team={mockTeam}
                members={mockMembers}
                onJoinTeam={handleJoinTeam}
                onLeaveTeam={handleLeaveTeam}
                onUpdateTeam={handleUpdateTeam}
                onDisbandTeam={handleDisbandTeam}
                onRemoveMember={handleRemoveMember}
                isAdmin={true}
              />
            </div>
          </section>

          {/* All Cards in Grid Layout */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              All Cards in Grid Layout
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">Article Card</h3>
                <ArticleCard {...mockArticle} />
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">Competition Card</h3>
                <CompetitionCard
                  competition={mockCompetition}
                  isAdmin={false}
                  onClick={handleCompetitionClick}
                />
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">Recruitment Card</h3>
                <RecruitmentCard
                  recruitment={mockRecruitment}
                  isAdmin={false}
                />
              </div>
              
              <div className="md:col-span-2">
                <h3 className="text-lg font-medium text-gray-700 mb-4">Team Card</h3>
                <TeamCard
                  team={mockTeam}
                  members={mockMembers}
                  onJoinTeam={handleJoinTeam}
                  onLeaveTeam={handleLeaveTeam}
                  onUpdateTeam={handleUpdateTeam}
                  onDisbandTeam={handleDisbandTeam}
                  onRemoveMember={handleRemoveMember}
                  isAdmin={false}
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}