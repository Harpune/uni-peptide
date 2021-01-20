import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstituteDetailsComponent } from './institute-details.component';

describe('InstituteDetailsComponent', () => {
  let component: InstituteDetailsComponent;
  let fixture: ComponentFixture<InstituteDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstituteDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstituteDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
