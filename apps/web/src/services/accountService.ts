import { apiClient } from "@/lib/apiClient"
import type { AccountListResponse } from "@/types/account"

const BASE = "/api/runnii/account"

export const accountService = {
  getAccountListInSerialNo(serialNoList: number[]): Promise<AccountListResponse> {
    return apiClient.post(`${BASE}/getAccountListInSerialNo.do`, { serialNoList })
  },
}

export const accountKeys = {
  listInSerialNo: (serialNoList: number[]) => ["account", "list", serialNoList] as const,
}
