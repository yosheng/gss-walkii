import { useEffect, useState } from "react"
import { Input } from "@workspace/ui/components/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { Badge } from "@workspace/ui/components/badge"
import { ChevronUpIcon, ChevronDownIcon, ChevronsUpDownIcon, RefreshCwIcon } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

interface SummaryList {
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

type SortField = "distance" | "duration" | "score"
type SortDir = "asc" | "desc"

function SortIcon({ field, sortField, sortDir }: { field: SortField; sortField: SortField; sortDir: SortDir }) {
  if (field !== sortField) return <ChevronsUpDownIcon className="size-3.5 text-muted-foreground" />
  return sortDir === "asc"
    ? <ChevronUpIcon className="size-3.5" />
    : <ChevronDownIcon className="size-3.5" />
}

export function App() {
  const [data, setData] = useState<SummaryList[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [sortField, setSortField] = useState<SortField>("score")
  const [sortDir, setSortDir] = useState<SortDir>("desc")

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(
        "https://www.runnii4life.com/RUNNII/missionInfo/getMissionInfoSummaryGroupByGroupNo.do",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json, text/plain, */*",
            "User-Agent":
              "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
          },
          body: JSON.stringify({ missionNo: 2022260601, type: 1 }),
        }
      )
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      setData(json.summaryList ?? [])
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDir("desc")
    }
  }

  const filtered = data
    .filter((row) =>
      (row.GroupName ?? `隊伍 ${row.GroupNo}`)
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const v = a[sortField] - b[sortField]
      return sortDir === "asc" ? v : -v
    })

  return (
    <div className="flex min-h-svh flex-col gap-4 p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-semibold">任務排行榜</h1>
        <p className="text-sm text-muted-foreground">任務編號：2022260601</p>
      </div>

      <div className="flex items-center gap-2">
        <Input
          placeholder="搜索隊伍名稱..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <button
          onClick={fetchData}
          disabled={loading}
          className={cn(
            "inline-flex size-8 items-center justify-center rounded-lg border border-input text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50",
            loading && "animate-spin"
          )}
          aria-label="重新整理"
        >
          <RefreshCwIcon className="size-4" />
        </button>
        {!loading && !error && (
          <span className="text-xs text-muted-foreground">共 {filtered.length} 支隊伍</span>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          載入失敗：{error}
        </div>
      )}

      {loading ? (
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
                  得分
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
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                  {search ? "找不到符合的隊伍" : "暫無資料"}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((row, idx) => (
                <TableRow key={row.GroupNo}>
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
                  <TableCell className="text-muted-foreground text-xs">{row.finishTime}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </div>
  )
}