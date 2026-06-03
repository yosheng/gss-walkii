import { apiClient } from "@/lib/apiClient"
import type { MissionSummaryResponse } from "@/types/mission"

const MISSION_API =
  "https://www.runnii4life.com/RUNNII/missionInfo/getMissionInfoSummaryGroupByGroupNo.do"

export const missionService = {
  getSummaryByGroupNo(missionNo: number): Promise<MissionSummaryResponse> {
    return apiClient.post<MissionSummaryResponse>(MISSION_API, { missionNo, type: 1 })
  },
}

export const missionKeys = {
  summaryByGroupNo: (missionNo: number) => ["mission", "summary", missionNo] as const,
}
