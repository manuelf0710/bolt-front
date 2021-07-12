import { SubMenu } from './SubMenu.model';

export class Projects {
  updated_at: string;
  created_at: string;
  deleted_at: string;
  description_en: string;
  description_es: string;
  icon: string;
  id: string;
  name_en: string;
  name_es: string;
  status: number;
  submenus?: SubMenu[];
  access?: number;
  checked?: number;
}
