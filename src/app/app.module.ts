import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResponsiveModule } from 'ngx-responsive'
import { AvatarModule } from 'ngx-avatar';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { LayoutModule } from '@angular/cdk/layout';
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
import { MatExpansionModule } from '@angular/material/expansion';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatStepperModule } from '@angular/material/stepper';
import { ChartsModule } from 'ng2-charts';

import { HomeComponent } from './components/home/home.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UserComponent } from './components/user/user.component';
import { CreateInstituteComponent } from './components/institute-create/institute-create.component';
import { RecoveryCallbackComponent } from './components/callback-recovery/callback-recovery.component';
import { VerificationCallbackComponent } from './components/callback-verification/callback-verification.component';
import { InstituteDetailsComponent } from './components/institute-details/institute-details.component';
import { CreateProjectComponent } from './components/project-create/project-create.component';
import { ProjectComponent } from './components/project/project.component';
import { CustomStepperComponent } from './components/custom-stepper/custom-stepper.component';
import { CreateInstituteMemberComponent } from './components/institute-create-member/institute-create-member.component';
import { MemberInvitationCallbackComponent } from './components/callback-member-invitation/callback-member-invitation.component';
import { UploadFilesComponent } from './components/files-upload/files-upload.component';
import { PeptideLibraryComponent } from './components/peptide-library/peptide-library.component';
import { CreatePeptideLibraryComponent } from './components/peptide-library-create/peptide-library-create.component';
import { FilesPreviewComponent } from './components/files-peptide-preview/files-peptide-preview.component';
import { PeptideLibraryAllComponent } from './components/peptide-library-all/peptide-library-all.component';
import { PeptideDetailComponent } from './components/peptide-detail/peptide-detail.component';
import { SafePipe } from './pipe/safe-pipe/safe-pipe.pipe';
import { ProjectDetailComponent } from './components/project-detail/project-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PageNotFoundComponent,
    LoginComponent,
    RegisterComponent,
    UserComponent,
    CreateInstituteComponent,
    RecoveryCallbackComponent,
    VerificationCallbackComponent,
    InstituteDetailsComponent,
    CreateProjectComponent,
    ProjectComponent,
    CustomStepperComponent,
    CreateInstituteMemberComponent,
    MemberInvitationCallbackComponent,
    UploadFilesComponent,
    PeptideLibraryComponent,
    CreatePeptideLibraryComponent,
    FilesPreviewComponent,
    PeptideLibraryAllComponent,
    PeptideDetailComponent,
    SafePipe,
    ProjectDetailComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ChartsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ResponsiveModule.forRoot(),
    AvatarModule,
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
    MatExpansionModule,
    MatBadgeModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatStepperModule,
    CdkStepperModule,
    LayoutModule,
    FlexLayoutModule,
    NgxDropzoneModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
