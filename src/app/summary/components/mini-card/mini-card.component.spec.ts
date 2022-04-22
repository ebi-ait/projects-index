import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MiniCardComponent } from './mini-card.component';

describe('MiniCardComponent', () => {
  let component: MiniCardComponent;
  let fixture: ComponentFixture<MiniCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MiniCardComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiniCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
