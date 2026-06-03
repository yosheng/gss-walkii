import { Tabs, TabsList, TabsTrigger, TabsContent } from "@workspace/ui/components/tabs"
import { GroupRankingTable } from "@/components/GroupRankingTable"
import { RankedMemberTable } from "@/components/RankedMemberTable"

const MISSION_NO = 2022260601

export function App() {
  return (
    <div className="flex min-h-svh flex-col gap-4 p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-semibold">任務排行榜</h1>
        <p className="text-sm text-muted-foreground">任務編號：{MISSION_NO}</p>
      </div>

      <Tabs defaultValue="group">
        <TabsList>
          <TabsTrigger value="group">隊伍排行</TabsTrigger>
          <TabsTrigger value="personal">個人排行</TabsTrigger>
        </TabsList>

        <TabsContent value="group" className="pt-2">
          <GroupRankingTable />
        </TabsContent>

        <TabsContent value="personal" className="pt-2">
          <RankedMemberTable />
        </TabsContent>
      </Tabs>
    </div>
  )
}
