import { useState } from "react"
import { ChevronDownIcon, ChevronUpIcon, ChevronsUpDownIcon, RefreshCwIcon } from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import { Input } from "@workspace/ui/components/input"
import { Skeleton } from "@workspace/ui/components/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { cn } from "@workspace/ui/lib/utils"
import { useRankedMemberData } from "@/hooks/useRankedMemberData"
import type { RankedMemberEnriched } from "@/types/mission"

type SortField = "duration" | "score"
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

export function RankedMemberTable() {
  const [search, setSearch] = useState("")
  const [sortField, setSortField] = useState<SortField>("score")
  const [sortDir, setSortDir] = useState<SortDir>("desc")

  const { data, isLoading, error, refetch, isFetching } = useRankedMemberData()

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDir("desc")
    }
  }

  const rows: RankedMemberEnriched[] = data
    .filter((row) =>
      (row.accountName ?? "").toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const primary = a[sortField] - b[sortField]
      if (primary !== 0) return sortDir === "asc" ? primary : -primary
      if (sortField !== "duration") return b.duration - a.duration
      return 0
    })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="搜索姓名..."
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
          <span className="text-xs text-muted-foreground">共 {rows.length} 名成員</span>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          載入失敗：{error.message}
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10 text-center">#</TableHead>
            <TableHead>姓名</TableHead>
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
                得分
                <SortIcon field="score" sortField={sortField} sortDir={sortDir} />
              </span>
            </TableHead>
            <TableHead>距離</TableHead>
            <TableHead>卡路里</TableHead>
            <TableHead>階段</TableHead>
            <TableHead>最後同步</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 8 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : rows.length === 0
              ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                    {search ? "找不到符合的成員" : "暫無資料"}
                  </TableCell>
                </TableRow>
              )
              : rows.map((row, idx) => (
                  <TableRow key={row.id.accountSerialNo}>
                    <TableCell className="text-center text-muted-foreground">{idx + 1}</TableCell>
                    <TableCell className="font-medium">{row.accountName ?? "—"}</TableCell>
                    <TableCell>{row.duration.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{row.score}</Badge>
                    </TableCell>
                    <TableCell>{row.distance.toLocaleString()}</TableCell>
                    <TableCell>{row.calories.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline">Stage {row.stage}</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{row.finishTime}</TableCell>
                  </TableRow>
                ))}
        </TableBody>
      </Table>
    </div>
  )
}
