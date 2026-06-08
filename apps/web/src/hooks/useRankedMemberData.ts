import { useQuery } from "@tanstack/react-query"
import { accountKeys, accountService } from "@/services/accountService"
import { missionKeys, missionService } from "@/services/missionService"
import type { RankedMemberEnriched } from "@/types/mission"

const MISSION_NO = 2022260601
const RANKED_NUMBER = 500

export function useRankedMemberData() {
  const rankedQuery = useQuery({
    queryKey: missionKeys.rankedMembers(MISSION_NO, RANKED_NUMBER),
    queryFn: () => missionService.getRankedMembers(MISSION_NO, RANKED_NUMBER),
  })

  const serialNoList = (rankedQuery.data?.dataList ?? []).map((m) => m.id.accountSerialNo)

  const accountQuery = useQuery({
    queryKey: accountKeys.listInSerialNo(serialNoList),
    queryFn: () => accountService.getAccountListInSerialNo(serialNoList),
    enabled: serialNoList.length > 0,
  })

  const accountMap = new Map(
    (accountQuery.data?.dataList ?? []).map((a) => [a.serialNo, a])
  )

  const data: RankedMemberEnriched[] = (rankedQuery.data?.dataList ?? [])
    .map((member) => ({
      ...member,
      accountName: accountMap.get(member.id.accountSerialNo)?.name ?? member.name,
    }))
    .sort((a, b) => b.score - a.score || b.duration - a.duration)

  return {
    data,
    isLoading: rankedQuery.isLoading,
    isFetching: rankedQuery.isFetching || accountQuery.isFetching,
    error: rankedQuery.error ?? accountQuery.error,
    refetch: rankedQuery.refetch,
  }
}
