import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeptideDetailComponent } from './peptide-detail.component';

describe('PeptideDetailComponent', () => {
  let component: PeptideDetailComponent;
  let fixture: ComponentFixture<PeptideDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeptideDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeptideDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
