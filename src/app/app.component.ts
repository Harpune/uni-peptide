import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AppwriteService } from './services/appwrite/appwrite.service';
import { environment } from 'src/environments/environment'
import { Account } from './models/account';
import { ActivatedRoute, ActivationEnd, Event, NavigationEnd, Router } from '@angular/router';
import { Session } from './models/session';
import { HostListener } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Institute, PeptideLibrary, Project } from './models/institute';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTree, MatTreeNestedDataSource } from '@angular/material/tree';
import { MatDialog } from '@angular/material/dialog';
import { CreateProjectComponent } from './components/project-create/project-create.component';
import { MatStepper } from '@angular/material/stepper';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
  }]
})
export class AppComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav
  @ViewChild('tree') tree!: MatTree<Project>
  @ViewChild('stepper') stepper!: MatStepper;


  title = 'Peptide'
  logo = 'assets/img/logo.png'
  uni = 'assets/img/uni.svg'
  isMobile!: boolean
  useStepper: boolean = false
  linear: boolean = true

  instiuteStep = 'Institut'
  projectStep = 'Project'
  peptideLibraryStep = 'Peptide'

  inactiveState = 'inactive'
  activeState = 'active'

  stepItems = [
    {
      label: this.instiuteStep,
      state: this.inactiveState,
      step: this.instiuteStep
    },
    {
      label: this.projectStep,
      state: this.inactiveState,
      step: this.projectStep
    },
    {
      label: this.peptideLibraryStep,
      state: this.inactiveState,
      step: this.peptideLibraryStep
    },
  ]

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

  instituteId!: string
  projectId!: string
  peptideId!: string

  account!: Account | null
  institutes!: Institute[]
  institute: Institute | null = null
  project: Project | null = null
  peptideLibrary: PeptideLibrary | null = null

  treeControl = new NestedTreeControl<Project>(node => node.subprojects)
  dataSource = new MatTreeNestedDataSource<Project>()
  hasChild = (_: number, node: Project) => !!node.subprojects && node.subprojects.length > 0
  projectExpanded: boolean = true

  constructor(private appwriteService: AppwriteService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router) { }

  ngOnInit(): void {
    this.isMobile = window.innerWidth <= environment.mobileSize
    this.router.events.subscribe((event: Event) => {
      if (event instanceof ActivationEnd) {
        this.getAccount()
        this.getInstitutes()

        // get params even if not exist
        let instituteId = event.snapshot.params['instituteId']
        let projectId = event.snapshot.params['projectId']
        let peptideId = event.snapshot.params['peptideId']

        // dont show stepper if none exist
        this.useStepper = instituteId || projectId || peptideId

        // make ids globally available
        this.instituteId = instituteId
        this.projectId = projectId
        this.peptideId = peptideId

        // get data
        this.getData()
      }
    })
  }

  async getData() {

    if (this.instituteId) {
      await this.getCurrentInstitute(this.instituteId)
    } else {
      this.stepItems[0].label = this.instiuteStep
    }

    if (this.projectId) {
      await this.getCurrentProject(this.projectId)
    } else {
      this.stepItems[1].label = this.projectStep
    }

    if (this.peptideId) {
      await this.getCurrentPeptideLibrary(this.peptideId)
    } else {
      this.stepItems[2].label = this.peptideLibraryStep
    }
  }

  async getCurrentInstitute(instituteId: string) {
    try {
      this.institute = await this.appwriteService.getInstitute(instituteId)
      if (this.institute) {
        this.dataSource.data = this.institute.projects
        this.stepItems[0].label = this.institute ? this.institute.name : this.instiuteStep

        if (!this.projectId && !this.peptideId) {
          this.stepper.selectedIndex = 0
          this.stepItems[0].state = this.activeState
          this.stepItems[1].state = this.inactiveState
          this.stepItems[2].state = this.inactiveState
        } else {
          this.stepItems[0].state = this.inactiveState
        }

      }
    } catch (e) {
      console.log('Error getting current institute', e)
    }
  }

  async getCurrentProject(projectId: string) {
    try {
      this.project = await this.appwriteService.getProject(projectId)
      if (this.project) {
        this.stepItems[1].label = this.project ? this.project.name : this.projectStep

        if (!this.peptideId) {
          this.stepper.selectedIndex = 1
          this.stepItems[0].state = this.inactiveState
          this.stepItems[1].state = this.activeState
          this.stepItems[2].state = this.inactiveState
        } else {
          this.stepItems[1].state = this.inactiveState
        }
      }
    } catch (e) {
      console.log('Error getting current project', e)
    }
  }

  async getCurrentPeptideLibrary(peptideLibraryId: string) {
    try {
      this.peptideLibrary = await this.appwriteService.getPeptideLibrary(peptideLibraryId)
      if (this.peptideLibrary) {
        this.stepItems[2].label = this.peptideLibrary ? this.peptideLibrary.name : this.peptideLibraryStep

        this.stepper.selectedIndex = 2
        this.stepItems[0].state = this.inactiveState
        this.stepItems[1].state = this.inactiveState
        this.stepItems[2].state = this.activeState
      }
    } catch (e) {
      console.log('Error getting current peptideLibrary', e)
    }
  }

  selectionChange(event: any) {
    console.log(event)
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

  openProjectDialog() {
    const dialogRef = this.dialog.open(CreateProjectComponent, {
      data: this.institute
    })

    dialogRef.afterClosed().subscribe(project => {
      console.log('Created Project', project)
      if (this.institute && project) {

        if (!this.institute.projects) {
          this.institute.projects = []
        }

        this.institute.projects.push(project)
        this.appwriteService.updateInstitute(this.institute)
          .then(() => this.getInstitutes())
      }
    })
  }

  showProject(project: Project) {
    this.router.navigate(['/institute/' + this.institute?.$id + '/project/' + project.$id])
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
