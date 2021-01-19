import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Institute, Project } from 'src/app/models/institute';
import { Membership } from 'src/app/models/team';
import { Account } from 'src/app/models/account';
import { AppwriteService } from 'src/app/service/appwrite/appwrite.service';
import { CreateInstituteMemberComponent } from '../institute-create-member/institute-create-member.component';
import { CreateProjectComponent } from '../project-create/project-create.component';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';

export interface MiniFab {
  icon: string;
  label: string;
  id: string;
  color?: string;
}

@Component({
  selector: 'app-institute-details',
  templateUrl: './institute-details.component.html',
  styleUrls: ['./institute-details.component.scss']
})
export class InstituteDetailsComponent implements OnInit {

  @ViewChild('projectPaginator') projectPaginator!: MatPaginator
  @ViewChild('projectSort') projectSort!: MatSort
  @ViewChild('membershipPaginator') membershipPaginator!: MatPaginator
  @ViewChild('membershipSort') membershipSort!: MatSort

  id!: string
  institute!: Institute
  projects!: Project[]
  isOwner!: boolean
  account!: Account

  displayedMemberColumns: string[] = ['name', 'email', 'joined']
  membershipData!: MatTableDataSource<Membership>

  miniFabButtons: MiniFab[] = []
  miniFabsShown: boolean = false;
  fabButtons: MiniFab[] = [{ icon: 'person_add', label: 'Mitglied', id: 'member' },
  { icon: 'lightbulb_outline', label: 'Projekt', id: 'project' }]

  treeControl = new NestedTreeControl<Project>(node => node.subprojects)
  dataSource = new MatTreeNestedDataSource<Project>()
  hasChild = (_: number, node: Project) => !!node.subprojects && node.subprojects.length > 0

  constructor(private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private appwriteService: AppwriteService) { }

  ngOnInit(): void {
    // get project-id
    const id = this.route.snapshot.paramMap.get('instituteId')
    if (id) this.id = id

    // get data
    this.getData()
  }

  async getData() {
    await this.getProject()
    await this.getMembers()
    await this.getAccount()
  }

  async getProject() {
    try {
      this.institute = await this.appwriteService.getInstitute(this.id)

      this.projects = this.institute.projects
      console.log('projects', this.projects)
      if (!this.projects) this.projects = []
      this.dataSource.data = this.projects
    } catch (e) {
      console.log('getProject', e)
    }
  }


  async getMembers() {
    try {
      let memberships: Membership[] = await this.appwriteService.getTeamMemberships(this.institute.teamId)
      this.membershipData = new MatTableDataSource();

      if (!memberships) memberships = []

      this.membershipData.data = memberships
      this.membershipData.paginator = this.membershipPaginator
      this.membershipData.sort = this.membershipSort
    } catch (e) {
      console.log('getMembers', e)
    }
  }

  async getAccount() {
    try {
      this.account = await this.appwriteService.getAccount()
      console.log('Account', this.account)

      this.isOwner = this.account.roles
        .filter(role => role.includes(this.institute.teamId))
        .some(role => role.includes('owner'))

      if (this.isOwner && !this.displayedMemberColumns.includes('owner')) {
        this.displayedMemberColumns.push('owner')
      }
    } catch (e) {
      console.log('getAccount', e)
    }
  }

  showProject(project: Project) {
    this.router.navigate(['./project/' + project.$id], { relativeTo: this.route })
  }

  openProjectDialog() {
    const dialogRef = this.dialog.open(CreateProjectComponent, {
      data: this.institute
    })

    dialogRef.afterClosed().subscribe(res => {
      console.log('Res Dialog', res)
      this.getData()
      this.hideMiniFabs()
    })
  }

  openMembershipDialog() {
    const dialogRef = this.dialog.open(CreateInstituteMemberComponent, {
      data: this.institute
    })

    dialogRef.afterClosed().subscribe(res => {
      console.log('Res Dialog', res)
      this.getData()
      this.hideMiniFabs()
    })

  }

  toggleMiniFabs() {
    if (this.miniFabsShown) {
      this.miniFabButtons = []
    } else {
      this.miniFabButtons = this.fabButtons
    }
    this.miniFabsShown = !this.miniFabsShown
  }

  hideMiniFabs() {
    this.miniFabButtons = []
    this.miniFabsShown = false
  }

  miniFabClicked(miniFab: MiniFab) {
    switch (miniFab.id) {
      case 'member':
        this.openMembershipDialog()
        break;
      case 'project':
        this.openProjectDialog()
        break;
    }
  }

  onRightClick() {
    console.log('right')
    return false
  }

  deleteInstitute() {
    if (confirm('Wollen wirklich das Institut löschen? Das kann nicht rückgängig gemacht werden.')) {

    }
  }

  async leaveInstitute(membership?: Membership) {
    console.log('Element', membership)
    if (confirm('Wollen wirklich das Institut verlassen?')) {
      try {
        if (!membership) {
          membership = this.membershipData.data.find(membership => membership.userId === this.account.$id)
        }

        if (membership) {
          await this.appwriteService.deleteMembershipStatus(this.institute.teamId, membership.$id)
        } else {
          console.log('Could not delete membership', 'No membership found', membership)
        }

      } catch (e) {
        console.log('Could not delete membership', e)
      } finally {
        this.getMembers()
      }
    }
  }
}
