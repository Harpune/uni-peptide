import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationCallbackComponent } from './callback-verification.component';

describe('CallbackVerificationComponent', () => {
  let component: VerificationCallbackComponent;
  let fixture: ComponentFixture<VerificationCallbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerificationCallbackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificationCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
