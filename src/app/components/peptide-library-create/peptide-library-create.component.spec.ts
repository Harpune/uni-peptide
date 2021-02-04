import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePeptideLibraryComponent } from './peptide-library-create.component';

describe('PeptideLibraryCreateComponent', () => {
  let component: CreatePeptideLibraryComponent;
  let fixture: ComponentFixture<CreatePeptideLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePeptideLibraryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePeptideLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
