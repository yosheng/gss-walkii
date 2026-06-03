import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { ChevronDownIcon, ChevronUpIcon, ChevronsUpDownIcon, RefreshCwIcon } from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import { Input } from "@workspace/ui/components/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { cn } from "@workspace/ui/lib/utils"
import { missionKeys, missionService } from "@/services/missionService"
import type { SummaryList } from "@/types/mission"
import { MemberDialog } from "@/components/MemberDialog"

const MISSION_NO = 2022260601

type SortField = "duration" | "score" | "distance"
type SortDir = "asc" | "desc"

function SortIcon({
  field,
  sortField,
  sortDir,
}: {
  field: SortField
  sortField: SortField
  sortDir: SortDir
}) {
  if (field !== sortField)
    return <ChevronsUpDownIcon className="size-3.5 text-muted-foreground" />
  return sortDir === "asc" ? (
    <ChevronUpIcon className="size-3.5" />
  ) : (
    <ChevronDownIcon className="size-3.5" />
  )
}

export function App() {
  const [search, setSearch] = useState("")
  const [sortField, setSortField] = useState<SortField>("score")
  const [sortDir, setSortDir] = useState<SortDir>("desc")
  const [selectedGroup, setSelectedGroup] = useState<SummaryList | null>(null)

  const { data, isFetching, error, refetch } = useQuery({
    queryKey: missionKeys.summaryByGroupNo(MISSION_NO),
    queryFn: () => missionService.getSummaryByGroupNo(MISSION_NO),
  })

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDir("desc")
    }
  }

  const rows: SummaryList[] = (data?.summaryList ?? [])
    .filter((row) =>
      (row.GroupName ?? `隊伍 ${row.GroupNo}`)
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const primary = a[sortField] - b[sortField]
      if (primary !== 0) return sortDir === "asc" ? primary : -primary
      if (sortField !== "duration") return b.duration - a.duration
      return 0
    })

  return (
    <div className="flex min-h-svh flex-col gap-4 p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-semibold">任務排行榜</h1>
        <p className="text-sm text-muted-foreground">任務編號：{MISSION_NO}</p>
      </div>

      <div className="flex items-center gap-2">
        <Input
          placeholder="搜索隊伍名稱..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className={cn(
            "inline-flex size-8 items-center justify-center rounded-lg border border-input text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50",
            isFetching && "animate-spin"
          )}
          aria-label="重新整理"
        >
          <RefreshCwIcon className="size-4" />
        </button>
        {!isFetching && !error && (
          <span className="text-xs text-muted-foreground">共 {rows.length} 支隊伍</span>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          載入失敗：{error.message}
        </div>
      )}

      {isFetching && !data ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <RefreshCwIcon className="size-4 animate-spin" />
          載入中...
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10 text-center">#</TableHead>
              <TableHead>隊伍名稱</TableHead>
              <TableHead className="text-center">人數</TableHead>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort("duration")}
              >
                <span className="inline-flex items-center gap-1">
                  累計步數
                  <SortIcon field="duration" sortField={sortField} sortDir={sortDir} />
                </span>
              </TableHead>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort("score")}
              >
                <span className="inline-flex items-center gap-1">
                  植樹點數
                  <SortIcon field="score" sortField={sortField} sortDir={sortDir} />
                </span>
              </TableHead>
              <TableHead>階段</TableHead>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort("distance")}
              >
                <span className="inline-flex items-center gap-1">
                  距離
                  <SortIcon field="distance" sortField={sortField} sortDir={sortDir} />
                </span>
              </TableHead>
              <TableHead>最後同步</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                  {search ? "找不到符合的隊伍" : "暫無資料"}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, idx) => (
                <TableRow
                  key={row.GroupNo}
                  className="cursor-pointer"
                  onClick={() => setSelectedGroup(row)}
                >
                  <TableCell className="text-center text-muted-foreground">{idx + 1}</TableCell>
                  <TableCell className="font-medium">
                    {row.GroupName ?? `隊伍 ${row.GroupNo}`}
                  </TableCell>
                  <TableCell className="text-center">{row.count}</TableCell>
                  <TableCell>{row.duration.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{row.score}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">Stage {row.stage}</Badge>
                  </TableCell>
                  <TableCell>{row.distance.toLocaleString()}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{row.finishTime}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}

      <MemberDialog
        group={selectedGroup}
        onClose={() => setSelectedGroup(null)}
      />
    </div>
  )
}
