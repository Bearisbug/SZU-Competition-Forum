import {FilterCategory} from "@/modules/global/global.model";
import {fetchCompetitionLevels} from "@/modules/competition/competition.api";
import {Result} from "@/lib/result";

export async function getCompetitionFilterCategories(): Promise<Result<FilterCategory[], Error>> {
  const levelsFetchResult = await fetchCompetitionLevels();
  if (!levelsFetchResult.ok) {
    return {
      ok: false,
      value: Error("筛选相关信息获取失败！")
    };
  }

  const filterCategories: FilterCategory[] = [
    {
      title: "比赛等级",
      key: "competition_level",
      options: levelsFetchResult.value.map((level) => {
        return {
          label: level.translation,
          key: level.key,
          children: level.subtypes.map((subtype) => {
            return {
              label: subtype.translation,
              key: subtype.key
            }
          })
        }
      })
    }
  ];

  return {
    ok: true,
    value: filterCategories
  };
}