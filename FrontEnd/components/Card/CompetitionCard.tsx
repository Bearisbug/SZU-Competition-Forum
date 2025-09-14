'use client'

import React, {useEffect, useState} from 'react';
import { Trash2, Pencil } from "lucide-react";
import { formatDate } from "@/lib/date";
import {Competition, CompetitionLevel} from "@/modules/competition/competition.model";

interface CompetitionCardProps {
  competition: Competition;
  competitionLevels: CompetitionLevel[] | null;
  isAdmin?: boolean;
  onDelete?: (id: number) => void;
  onClick?: (id: number) => void;
}

const competitionLevelColors = [
  "#2563eb",
  "#16a34a",
  "#9333ea"
];

const CompetitionCard: React.FC<CompetitionCardProps> = ({
  competition,
  competitionLevels,
  isAdmin = false,
  onDelete, 
  onClick
}) => {
  if (!competition) return null;

  const [competitionLevelColorDict, setCompetitionLevelColorDict] = useState<Record<string, string> | null>(null);
  useEffect(() => {
    if (competitionLevels) {
      const dict: Record<string, string> = {};
      competitionLevels.forEach((level, index) => {
        dict[level.key] = competitionLevelColors[index % competitionLevelColors.length];
      });
      setCompetitionLevelColorDict(dict);
    }
  }, [competitionLevels])

  const handleClick = () => {
    if (onClick) onClick(competition.id!);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) onDelete(competition.id!);
  };

  return (
    <div
      className="relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group"
      onClick={handleClick}
    >
      {/* 顶图 */}
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
        <div
          className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url('${competition.cover_image}')` }}
        />
        <div className="absolute bottom-4 left-4 z-20">
          <span
            className={`text-white text-xs px-3 py-1 rounded-full font-medium`
          }
            style={{
              backgroundColor: competitionLevelColorDict ? competitionLevelColorDict[competition.competition_level_key] : competitionLevelColors[0]
            }}
          >
            {`${competition.competition_level} - ${competition.competition_subtype}`}
          </span>
        </div>
      </div>

      {/* 文本内容 */}
      <div className="p-5">
        <h4 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
          {competition.name}
        </h4>
        <div
          className="text-sm text-gray-600 mb-3 line-clamp-2"
          dangerouslySetInnerHTML={{ __html: competition.details }}
        />
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>
            {formatDate(competition.created_at)}
          </span>
        </div>
      </div>

      {isAdmin && (
        <>
          <button
            className="absolute bottom-4 right-16 z-30 rounded-full p-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 shadow-sm"
            onClick={(e) => { e.stopPropagation(); window.location.href = `/competition/${competition.id}/edit`; }}
            title="修改比赛"
            aria-label="修改比赛"
          >
            <Pencil className="w-5 h-5 text-blue-600" />
          </button>
          <button
            className="absolute bottom-4 right-4 z-30 rounded-full p-2 bg-red-50 hover:bg-red-100 border border-red-200 shadow-sm"
            onClick={handleDelete}
            title="删除比赛"
            aria-label="删除比赛"
          >
            <Trash2 className="w-5 h-5 text-red-600" />
          </button>
        </>
      )}
    </div>
  );
};

export default CompetitionCard;
