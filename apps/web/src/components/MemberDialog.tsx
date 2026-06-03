import { useQuery } from "@tanstack/react-query"
import { Badge } from "@workspace/ui/components/badge"
import { Skeleton } from "@workspace/ui/components/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { missionKeys, missionService } from "@/services/missionService"
import type { SummaryList } from "@/types/mission"

const MISSION_NO = 2022260601

export function MemberDialog({
  group,
  onClose,
}: {
  group: SummaryList | null
  onClose: () => void
}) {
  const { data, isLoading } = useQuery({
    queryKey: missionKeys.listByMissionNo(MISSION_NO, group?.GroupNo ?? 0),
    queryFn: () => missionService.getListByMissionNo(MISSION_NO, group!.GroupNo),
    enabled: group !== null,
  })

  return (
    <Dialog open={group !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{group?.GroupName ?? `隊伍 ${group?.GroupNo}`}</DialogTitle>
          <DialogDescription>共 {group?.count} 名成員</DialogDescription>
        </DialogHeader>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>姓名</TableHead>
              <TableHead>累計步數</TableHead>
              <TableHead>得分</TableHead>
              <TableHead>距離</TableHead>
              <TableHead>卡路里</TableHead>
              <TableHead>階段</TableHead>
              <TableHead>最後同步</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : (data?.dataList ?? []).map((member) => (
                  <TableRow key={member.id.accountSerialNo}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{member.duration.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{member.score}</Badge>
                    </TableCell>
                    <TableCell>{member.distance.toLocaleString()}</TableCell>
                    <TableCell>{member.calories.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline">Stage {member.stage}</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {member.finishTime}
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  )
}
