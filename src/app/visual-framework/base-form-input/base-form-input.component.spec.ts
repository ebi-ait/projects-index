import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BaseFormInputComponent } from './base-form-input.component';

describe('BaseFormInputComponent', () => {
  let component: BaseFormInputComponent;
  let fixture: ComponentFixture<BaseFormInputComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BaseFormInputComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseFormInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
