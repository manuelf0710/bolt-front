import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { LoadingComponent } from './components/loading/loading.component';
import { TutorialComponent } from './components/tutorial/tutorial.component';

import { ModalNotificationComponent } from './pop up/modal-notification/modal-notification.component';
import { ModalRolFormComponent } from './pop up/modal-rol-form/modal-rol-form.component';
import { ModalAlertComponent } from './pop up/modal-alert/modal-alert.component';

import { LoginComponent } from './login/login.component';
import { ModalConfirmationComponent } from './pop up/modal-confirmation/modal-confirmation.component';
import { ModalProjectFormComponent } from './admin/projects/modal-project-form/modal-project-form.component';
import { ModalAppAssoccComponent } from './admin/projects/modal-app-assocc/modal-app-assocc.component';
import { ModalSubmenuFormComponent } from './admin/projects/modal-submenu-form/modal-submenu-form.component';
import { RolFormComponent } from './admin/roles-and-users/rol-form/rol-form.component';
import { ToggleSideDirective } from 'src/app/directives/toggle-side.directive';

@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    LoadingComponent,
    TutorialComponent,
    FooterComponent,
    ModalNotificationComponent,
    ModalRolFormComponent,
    ModalAlertComponent,
    LoginComponent,
    ModalConfirmationComponent,
    ModalProjectFormComponent,
    ModalAppAssoccComponent,
    ModalSubmenuFormComponent,
    RolFormComponent,
    ToggleSideDirective,
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatDividerModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatExpansionModule,
    MatGridListModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatCheckboxModule,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    ModalNotificationComponent,
    ModalRolFormComponent,
    ModalAlertComponent,
    LoadingComponent,
  ],
})
export class UtilsModule {}
