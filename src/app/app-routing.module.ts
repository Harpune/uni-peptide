import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './guards/auth-guard.guard';
import { UserComponent } from './components/user/user.component';
import { CreateInstituteComponent } from './components/institute-create/institute-create.component';
import { RecoveryCallbackComponent } from './components/callback-recovery/callback-recovery.component';
import { VerificationCallbackComponent } from './components/callback-verification/callback-verification.component';
import { InstituteDetailsComponent } from './components/institute-details/institute-details.component';
import { ProjectComponent } from './components/project/project.component';
import { MemberInvitationCallbackComponent } from './components/callback-member-invitation/callback-member-invitation.component';
import { PeptideLibraryComponent } from './components/peptide-library/peptide-library.component';
import { PeptideDetailComponent } from './components/peptide-detail/peptide-detail.component';
import { ProjectDetailComponent } from './components/project-detail/project-detail.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'recovery', component: RecoveryCallbackComponent },
  { path: 'verification', component: VerificationCallbackComponent },
  { path: 'invitation', component: MemberInvitationCallbackComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'user', component: UserComponent, canActivate: [AuthGuard] },
  { path: 'peptide-library', component: PeptideLibraryComponent, canActivate: [AuthGuard] },
  { path: 'peptide-library/:peptideId', component: PeptideDetailComponent, canActivate: [AuthGuard] },
  { path: 'institute/:instituteId', component: InstituteDetailsComponent, canActivate: [AuthGuard] },
  { path: 'institute/create', component: CreateInstituteComponent, canActivate: [AuthGuard] },
  { path: 'institute/:instituteId/project/:projectId', component: ProjectComponent, canActivate: [AuthGuard] },
  { path: 'institute/:instituteId/project/:projectId/peptide/:peptideId', component: ProjectDetailComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/home', pathMatch: 'full', canActivate: [AuthGuard] },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
