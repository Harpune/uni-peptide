import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberInvitationCallbackComponent } from './callback-member-invitation.component';

describe('CallbackMemberInvitationComponent', () => {
  let component: MemberInvitationCallbackComponent;
  let fixture: ComponentFixture<MemberInvitationCallbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberInvitationCallbackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberInvitationCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
