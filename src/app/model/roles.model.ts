import { Projects } from './Projects.model'
import { SubMenu } from './SubMenu.model'
import { AppList } from './AppList'

export class Roles {
  status: number
  name_es: string
  name_en: string
  description_es: string
  description_en: string
  created_at: string
  created_by: string
  deleted_at: string
  updated_by: string
  projects?: Projects[]
  submenus?: SubMenu[]
  apps?: AppList[]
}
