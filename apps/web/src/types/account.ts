export interface AccountItem {
  accountStatus: number
  averageDistance: number
  birthday: string
  chartletAuthority: string
  coupleSerialNo: number
  deviceType: number
  estimate: number
  fbIdentification: unknown
  gender: boolean
  height: number
  identification: unknown
  image: unknown
  interest: number
  level: number
  name: string
  notificationId: string
  password: unknown
  runniiPower: number
  serialNo: number
  slogan: string
  totalDistance: number
  weight: number
}

export interface AccountListResponse {
  dataList: AccountItem[]
}
