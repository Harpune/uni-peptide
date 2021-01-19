import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ResponsiveModule } from 'ngx-responsive'
import { AvatarModule } from 'ngx-avatar';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxDropzoneModule } from 'ngx-dropzone';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';

import { InstituteComponent } from './component/institute/institute.component';
import { HomeComponent } from './component/home/home.component';
import { PageNotFoundComponent } from './component/page-not-found/page-not-found.component';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpErrorInterceptor } from './interceptor/http-error/http-error.interceptor';
import { UserComponent } from './component/user/user.component';
import { TeamComponent } from './component/teams/teams.component';
import { CreateInstituteComponent } from './component/institute-create/institute-create.component';
import { RecoveryCallbackComponent } from './component/callback-recovery/callback-recovery.component';
import { VerificationCallbackComponent } from './component/callback-verification/callback-verification.component';
import { InstituteDetailsComponent } from './component/institute-details/institute-details.component';
import { CreateProjectComponent } from './component/project-create/project-create.component';
import { ProjectComponent } from './component/project/project.component';
import { CustomStepperComponent } from './component/custom-stepper/custom-stepper.component';
import { CreateInstituteMemberComponent } from './component/institute-create-member/institute-create-member.component';
import { MemberInvitationCallbackComponent } from './component/callback-member-invitation/callback-member-invitation.component';
import { SubProjectCreateComponent } from './component/project-sub-create/project-sub-create.component';
import { UploadFilesComponent } from './component/upload-files/upload-files.component';

@NgModule({
  declarations: [
    AppComponent,
    InstituteComponent,
    HomeComponent,
    PageNotFoundComponent,
    LoginComponent,
    RegisterComponent,
    UserComponent,
    TeamComponent,
    CreateInstituteComponent,
    RecoveryCallbackComponent,
    VerificationCallbackComponent,
    InstituteDetailsComponent,
    CreateProjectComponent,
    ProjectComponent,
    CustomStepperComponent,
    CreateInstituteMemberComponent,
    MemberInvitationCallbackComponent,
    SubProjectCreateComponent,
    UploadFilesComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ResponsiveModule.forRoot(),
    AvatarModule,
    HttpClientModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatInputModule,
    MatCardModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatGridListModule,
    MatTabsModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatTreeModule,
    CdkStepperModule,
    FlexLayoutModule,
    NgxDropzoneModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
