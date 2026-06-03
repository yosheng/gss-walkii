import { apiClient } from "@/lib/apiClient"
import type { MissionListResponse, MissionSummaryResponse, RankedMissionResponse } from "@/types/mission"

const BASE = "/api/runnii/missionInfo"

export const missionService = {
  getSummaryByGroupNo(missionNo: number): Promise<MissionSummaryResponse> {
    return apiClient.post(`${BASE}/getMissionInfoSummaryGroupByGroupNo.do`, { missionNo, type: 1 })
  },

  getListByMissionNo(missionNo: number, groupNo: number): Promise<MissionListResponse> {
    return apiClient.post(`${BASE}/getMissionInfoListByMissionNo.do`, { missionNo, groupNo })
  },

  getRankedMembers(missionNo: number, number: number): Promise<RankedMissionResponse> {
    return apiClient.post(`${BASE}/getRankedMissionInfoByMissionNoAndNumber.do`, { missionNo, number })
  },
}

export const missionKeys = {
  summaryByGroupNo: (missionNo: number) => ["mission", "summary", missionNo] as const,
  listByMissionNo: (missionNo: number, groupNo: number) =>
    ["mission", "list", missionNo, groupNo] as const,
  rankedMembers: (missionNo: number, number: number) =>
    ["mission", "ranked", missionNo, number] as const,
}
