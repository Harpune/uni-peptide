import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeptideLibraryComponent } from './peptide-library.component';

describe('PeptideLibraryComponent', () => {
  let component: PeptideLibraryComponent;
  let fixture: ComponentFixture<PeptideLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeptideLibraryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeptideLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
