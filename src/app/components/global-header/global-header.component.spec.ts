import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router, RouterEvent } from '@angular/router';
import { ReplaySubject } from 'rxjs';

import { GlobalHeaderComponent } from './global-header.component';

describe('GlobalHeaderComponent', () => {
  let component: GlobalHeaderComponent;
  let fixture: ComponentFixture<GlobalHeaderComponent>;

  beforeEach(waitForAsync(() => {
    let routerEventRelaySubject = new ReplaySubject<RouterEvent>(1);
    let routerMock = {
      events: routerEventRelaySubject.asObservable(),
    };

    TestBed.configureTestingModule({
      declarations: [GlobalHeaderComponent],
      providers: [{ provide: Router, useValue: routerMock }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
