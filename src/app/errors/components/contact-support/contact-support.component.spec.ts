import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContactSupportComponent } from './contact-support.component';

describe('ContactSupportComponent', () => {
  let component: ContactSupportComponent;
  let fixture: ComponentFixture<ContactSupportComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ContactSupportComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
