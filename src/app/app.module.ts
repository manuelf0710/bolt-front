import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UtilsModule } from './components/utils/utils.module';
import { HomeComponent } from './components/home/home/home.component';

import { MatCarouselModule } from '@ngmodule/material-carousel';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpService } from './services/http.service';
import { AuthService } from './services/auth.service';

import { EmbedViewComponent } from './components/home/embed-view/embed-view.component';
import { ProjectsComponent } from './components/admin/projects/projects.component';
import { RolesComponent } from './components/admin/roles/roles/roles.component';
import { BannersComponent } from './components/admin/banners/banners.component';
import { SubmenuViewComponent } from './components/admin/submenu-view/submenu-view.component';
import { UsersComponent } from './components/admin/roles/users/users.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatGridListModule } from '@angular/material/grid-list';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { SafeUrlPipe } from './pipes/safeurl.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    EmbedViewComponent,
    ProjectsComponent,
    SubmenuViewComponent,
    RolesComponent,
    BannersComponent,
    UsersComponent,
    SafeUrlPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    UtilsModule,
    MatCarouselModule.forRoot(),
    MatCardModule,
    MatSnackBarModule,
    MatTabsModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatGridListModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  exports: [SafeUrlPipe],
  providers: [
    HttpService,
    AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
