import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BannersComponent } from './components/admin/banners/banners.component';
import { ProjectsComponent } from './components/admin/projects/projects.component';
import { EmbedViewComponent } from './components/home/embed-view/embed-view.component';
import { HomeComponent } from './components/home/home/home.component';
import { SubmenuViewComponent } from './components/admin/submenu-view/submenu-view.component';
import { LoginComponent } from './components/utils/login/login.component';
import { RolesComponent } from './components/admin/roles/roles/roles.component';
import { UsersComponent } from './components/admin/roles/users/users.component';
import { AuthGuard } from './services/auth.guard';
import { AdminGuard } from './services/admin.guard';

const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'app-view/:id',
    component: EmbedViewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin',
    canActivate: [AuthGuard, AdminGuard],
    children: [
      {
        path: 'projects', // child route path
        children: [
          {
            path: '', // child route path
            component: ProjectsComponent,
          },
          {
            path: 'submenu/:id', // child route path
            component: SubmenuViewComponent,
          },
        ],
      },
      {
        path: 'roles',
        children: [
          {
            path: '', // child route path
            component: RolesComponent,
          },
          {
            path: 'users', // child route path
            component: UsersComponent,
          },
        ],
      },
      {
        path: 'banners',
        component: BannersComponent, // another child route component that the router renders
      },
    ],
  },

  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
