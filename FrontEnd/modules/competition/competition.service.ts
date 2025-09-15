import {FilterCategory} from "@/modules/global/global.model";
import {CompetitionFilterCategoryKey, CompetitionLevel} from "@/modules/competition/competition.model";

export function getCompetitionFilterCategories(levels: CompetitionLevel[]): FilterCategory<CompetitionFilterCategoryKey>[] {
  return [
    {
      title: "比赛等级",
      key: "competition_level",
      options: levels.map((level) => {
        return {
          value: level.value,
          children: level.subtypes ? level.subtypes.map((subtype) => {
            return {
              value: subtype.value,
              children: []
            }
          }) : undefined
        }
      })
    }
  ];
}