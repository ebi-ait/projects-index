import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExternalLinkComponent } from './external-link.component';

describe('ExternalLinkComponent', () => {
  let component: ExternalLinkComponent;
  let fixture: ComponentFixture<ExternalLinkComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ExternalLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
