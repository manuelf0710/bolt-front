import { Component, OnDestroy, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { MatSlideToggleChange } from '@angular/material/slide-toggle'
import { Router } from '@angular/router'
import { UiService } from 'src/app/services/ui.service'
import { ModalConfirmationComponent } from '../../utils/pop up/modal-confirmation/modal-confirmation.component'
import { ModalProjectFormComponent } from '../../utils/admin/projects/modal-project-form/modal-project-form.component'
import { ModalSubmenuFormComponent } from '../../utils/admin/projects/modal-submenu-form/modal-submenu-form.component'
import { ProjectsService } from 'src/app/services/projects.service'
import { Subscription } from 'rxjs'
import { SubmenusService } from 'src/app/services/submenus.service'
import { Projects } from 'src/app/model/Projects.model'

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit, OnDestroy {
  private projSubs: Subscription
  public lang: string
  public projects: Projects[] = []
  public activeProjects: any = []
  public inactiveProjects: any = []
  public open: boolean = false
  public pages: number
  public projectPermission: boolean
  public subMenuPermission: boolean
  public message_action_es: string = 'deshabilitar'
  public message_action_en: string = 'disable'
  public active_count = 1
  public total_items: number

  constructor(
    public dialog: MatDialog,
    private ui: UiService,
    private router: Router,
    private projectService: ProjectsService,
    private submenuService: SubmenusService,
  ) {}

  ngOnInit(): void {
    this.lang = localStorage.getItem('lang') || 'Esp'
    this.getData(this.active_count)
  }

  getData(page: number) {
    this.ui.showLoading()
    this.projSubs = this.projectService.fullProjects$.subscribe(
      (projects: any) => {
        this.ui.dismissLoading()
        this.pages = projects.meta.totalPages
        this.active_count = projects.meta.currentPage
        this.projects = projects.items
        this.total_items = projects.meta.totalItems

        this.activeProjects = []
        this.inactiveProjects = []
        this.projects.forEach((project) => {
          if (project.status == 1) {
            this.activeProjects.push(project)
          } else {
            this.inactiveProjects.push(project)
          }
        })
      },
    )
    this.projectService.getData(page)
  }

  openPanel(id?: number | string) {
    this.open = !this.open
    let submenu = document.getElementById('submenu' + id)
    let extArrow = document.getElementById('arrowProject' + id)
    let box = document.getElementById('box' + id)

    if (this.open) {
      extArrow.classList.add('arrowDown')
      extArrow.classList.remove('arrowUp')
      submenu.classList.add('background-grey')
      submenu.classList.remove('background-transparent')
      box.setAttribute('style', 'display:inline')
    } else {
      extArrow.classList.add('arrowUp')
      extArrow.classList.remove('arrowDown')
      submenu.classList.add('background-transparent')
      submenu.classList.remove('background-grey')
      box.setAttribute('style', 'display:none')
    }
  }

  projectStatus(project, event, action) {
    if (event.checked) {
      let ProjName = project.name_es

      if (action == 'enable') {
        this.message_action_es = 'habilitar'
        this.message_action_en = 'enable'
      } else {
        this.message_action_es = 'deshabilitar'
        this.message_action_en = 'disable'
      }
      if (this.lang == 'Eng') {
        ProjName = project.name_en
      }

      const confDialog = this.dialog.open(ModalConfirmationComponent, {
        id: ModalConfirmationComponent.toString(),
        disableClose: true,
        hasBackdrop: true,
        width: '500px',
        height: 'auto',
        data: {
          project_name: ProjName,
          message_action_es: this.message_action_es,
          message_action_en: this.message_action_en,
        },
      })

      confDialog.afterClosed().subscribe((result) => {
        this.projectPermission = result
        let status
        if (this.projectPermission) {
          if (action == 'enable') {
            this.message_action_es = 'habilitó'
            this.message_action_en = 'enabled'
            status = 1
          } else {
            this.message_action_es = 'deshabilitó'
            this.message_action_en = 'disabled'
            status = 0
          }

          this.projectService.updateStatus(
            project,
            this.message_action_es,
            this.message_action_en,
          )
        } else {
          window.location.reload()
        }
      })
    }
  }

  subMenuDisable(submenuName, event: MatSlideToggleChange) {
    let message_es
    let message_en
    let state
    if (event.checked == false) {
      message_es = 'deshabilitar'
      message_en = 'disable'
      state = 0
    } else {
      message_es = 'habilitar'
      message_en = 'enable'
      state = 1
    }
    const confDialog = this.dialog.open(ModalConfirmationComponent, {
      id: ModalConfirmationComponent.toString(),
      disableClose: true,
      hasBackdrop: true,
      width: '500px',
      height: 'auto',
      data: {
        submenu_name: submenuName.name_es,
        message_action_es: message_es,
        message_action_en: message_en,
      },
    })

    confDialog.afterClosed().subscribe((result) => {
      this.projectPermission = result
      if (this.projectPermission) {
        if (event.checked == false) {
          message_es = 'deshabilitó'
          message_en = 'disabled'
          state = 0
        } else {
          message_es = 'habilitó'
          message_en = 'enabled'
          state = 1
        }
        this.submenuService.updateStatus(submenuName, message_es, message_en)
      } else {
        window.location.reload()
      }
    })
  }

  createProject(project?: any) {
    if (!project) {
      this.ui.showModal(ModalProjectFormComponent, '500px', 'auto', null, null)
    } else {
      this.ui.showModal(
        ModalProjectFormComponent,
        '500px',
        'auto',
        null,
        null,
        {
          project: project,
        },
      )
    }
  }

  deleteProject(project: any) {
    let message_es = 'eliminar'
    let message_en = 'delete'

    const confDialog = this.dialog.open(ModalConfirmationComponent, {
      id: ModalConfirmationComponent.toString(),
      disableClose: true,
      hasBackdrop: true,
      width: '500px',
      height: 'auto',
      data: {
        project_name: this.lang == 'Esp' ? project.name_es : project.name_en,
        message_action_es: message_es,
        message_action_en: message_en,
      },
    })

    confDialog.afterClosed().subscribe((result) => {
      this.projectPermission = result
      if (this.projectPermission) {
        message_es = 'eliminó'
        message_en = 'deleted'
        this.projectService.delete(project, message_es, message_en)
      }
    })
  }

  createSubmenu(project?: any) {
    this.ui.showModal(ModalSubmenuFormComponent, '500px', 'auto', null, null, {
      project: project,
    })
  }

  editSubMenu(submenuId: string) {
    this.router.navigate([`admin/projects/submenu/${submenuId}`], {
      queryParamsHandling: 'preserve',
    })
  }

  updatePage(page: string) {
    if (page == 'start') {
      this.active_count = 0
    }
    if (page == 'prev') {
      this.active_count--
    }
    if (page == 'next') {
      this.active_count++
    }
    if (page == 'last') {
      this.active_count = this.pages
    }
    this.getData(this.active_count)
  }

  ngOnDestroy() {
    this.projSubs.unsubscribe()
  }
}
