import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoveryCallbackComponent } from './callback-recovery.component';

describe('CallbackComponent', () => {
  let component: RecoveryCallbackComponent;
  let fixture: ComponentFixture<RecoveryCallbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecoveryCallbackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecoveryCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
