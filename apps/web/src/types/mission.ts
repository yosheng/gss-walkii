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
