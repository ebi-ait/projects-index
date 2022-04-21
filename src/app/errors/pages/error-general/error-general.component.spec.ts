import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ErrorGeneralComponent } from './error-general.component';

describe('ErrorGeneralComponent', () => {
  let component: ErrorGeneralComponent;
  let fixture: ComponentFixture<ErrorGeneralComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ErrorGeneralComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
