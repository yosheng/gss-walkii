export interface SummaryList {
  duration: number
  GroupName?: string
  score: number
  finishTime: string
  distance: number
  stage: number
  GroupNo: number
  count: number
  calories: number
}

export interface MissionSummaryResponse {
  summaryList: SummaryList[]
}

export interface RankedMemberItem {
  calories: number
  distance: number
  duration: number
  finishTime: string
  groupNo: number
  id: MissionListItemId
  name: string | null
  score: number
  stage: number
  status: number
}

export interface RankedMissionResponse {
  dataList: RankedMemberItem[]
}

export interface RankedMemberEnriched extends RankedMemberItem {
  accountName: string | null
}

export interface MissionListItemId {
  accountSerialNo: number
  missionNo: number
}

export interface MissionListItem {
  calories: number
  distance: number
  duration: number
  finishTime: string
  groupNo: number
  id: MissionListItemId
  name: string
  score: number
  stage: number
  status: number
}

export interface MissionListResponse {
  dataList: MissionListItem[]
}
