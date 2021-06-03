import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorJavascriptComponent } from './error-javascript.component';

describe('ErrorJavascriptComponent', () => {
  let component: ErrorJavascriptComponent;
  let fixture: ComponentFixture<ErrorJavascriptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorJavascriptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorJavascriptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
