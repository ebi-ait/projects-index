import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalEbiMenuComponent } from './global-ebi-menu.component';

describe('GlobalMenuComponent', () => {
  let component: GlobalEbiMenuComponent;
  let fixture: ComponentFixture<GlobalEbiMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobalEbiMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalEbiMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
