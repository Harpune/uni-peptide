import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InstituteComponent } from './component/institute/institute.component';
import { PageNotFoundComponent } from './component/page-not-found/page-not-found.component';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { HomeComponent } from './component/home/home.component';
import { AuthGuard } from './guard/auth-guard.guard';
import { UserComponent } from './component/user/user.component';
import { TeamComponent } from './component/teams/teams.component';
import { CreateInstituteComponent } from './component/institute-create/institute-create.component';
import { RecoveryCallbackComponent } from './component/callback-recovery/callback-recovery.component';
import { VerificationCallbackComponent } from './component/callback-verification/callback-verification.component';
import { InstituteDetailsComponent } from './component/institute-details/institute-details.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'recovery', component: RecoveryCallbackComponent },
  { path: 'verification', component: VerificationCallbackComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'user', component: UserComponent, canActivate: [AuthGuard] },
  { path: 'institute', component: InstituteComponent, canActivate: [AuthGuard] },
  { path: 'institute/:id', component: InstituteDetailsComponent, canActivate: [AuthGuard] },
  { path: 'institute/create', component: CreateInstituteComponent, canActivate: [AuthGuard] },
  { path: 'team', component: TeamComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/home', pathMatch: 'full', canActivate: [AuthGuard] },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
