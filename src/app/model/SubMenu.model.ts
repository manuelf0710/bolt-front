import { AppList } from './AppList'

export class SubMenu {
  created_at: string
  created_by: string
  deleted_at: string
  updated_by: string
  description_en: string
  description_es: string
  id: string
  name_en: string
  name_es: string
  project_id: string
  status: number
  access?: number
  updated_at: string
  apps?: AppList[]
}
