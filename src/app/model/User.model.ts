import { Roles } from './roles.model'

export class User {
  id: string
  status: 1
  name: string
  last_name: string
  email: string
  country: string
  employee_code: string
  roles: Roles[]
  created_at: string
  updated_at: string
  deleted_at: string
}
