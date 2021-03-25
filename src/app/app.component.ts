import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AppwriteService } from './services/appwrite/appwrite.service';
import { environment } from 'src/environments/environment'
import { Account } from './models/account';
import { ActivatedRoute, ActivationEnd, Event, NavigationEnd, Router } from '@angular/router';
import { Session } from './models/session';
import { HostListener } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Institute, Project } from './models/institute';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTree, MatTreeNestedDataSource } from '@angular/material/tree';
import { MatDialog } from '@angular/material/dialog';
import { CreateProjectComponent } from './components/project-create/project-create.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav
  @ViewChild('tree') tree!: MatTree<Project>

  title = 'Peptide'
  logo = 'assets/img/logo.png'
  uni = 'assets/img/uni.svg'
  isMobile!: boolean

  navItems = [
    {
      name: 'Home',
      route: '/home',
      icon: 'house'
    },
    {
      name: 'Mein Profil',
      route: '/user',
      icon: 'face'
    },
    {
      name: 'Peptid-Bibliothek',
      route: '/peptide-library',
      icon: 'local_library'
    }
  ]

  account!: Account | null
  institutes!: Institute[]
  currentInstitute!: Institute | null

  treeControl = new NestedTreeControl<Project>(node => node.subprojects)
  dataSource = new MatTreeNestedDataSource<Project>()
  hasChild = (_: number, node: Project) => !!node.subprojects && node.subprojects.length > 0
  projectExpanded: boolean = true

  constructor(private appwriteService: AppwriteService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        console.log(event)
        console.log('Navigated to', event.urlAfterRedirects)
        this.getAccount()
        this.getInstitutes()
      }

      if (event instanceof ActivationEnd) {
        let instituteId = event.snapshot.params['instituteId']
        if (instituteId) {
          this.getCurrentInstitutes(instituteId)
        } else {
          this.currentInstitute = null
        }
      }
    })
  }

  ngOnInit(): void {
    this.isMobile = window.innerWidth <= environment.mobileSize
  }

  async getAccount() {
    this.appwriteService.getAccount()
      .then((account: Account) => this.account = account)
      .catch(error => this.account = null)
  }

  async getInstitutes() {
    this.appwriteService.listInstitutes()
      .then((institutes: Institute[]) => this.institutes = institutes)
  }

  async getCurrentInstitutes(instituteId: string) {
    try {
      this.currentInstitute = await this.appwriteService.getInstitute(instituteId)
      this.dataSource.data = this.currentInstitute.projects
      // this.treeControl.expandAll()
    } catch (e) {
      console.log('Error getting current institute', e)
    }
  }

  openProjectDialog() {
    const dialogRef = this.dialog.open(CreateProjectComponent, {
      data: this.currentInstitute
    })

    dialogRef.afterClosed().subscribe(project => {
      console.log('Created Project', project)
      if (this.currentInstitute && project) {

        if (!this.currentInstitute.projects) {
          this.currentInstitute.projects = []
        }

        this.currentInstitute.projects.push(project)
        this.appwriteService.updateInstitute(this.currentInstitute)
          .then(() => this.getInstitutes())
      }
    })
  }

  showProject(project: Project) {
    this.router.navigate(['/institute/' + this.currentInstitute?.$id + '/project/' + project.$id])
  }

  logout(): void {
    this.appwriteService.getCurrentSession()
      .then((session: Session) => this.appwriteService.deleteSession(session.$id))
      .finally(() => this.router.navigate(['/login']))
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobile = event.target.innerWidth < environment.mobileSize
    if (this.account != null) {
      this.sidenav.toggle(!this.isMobile)
    }
  }
}
