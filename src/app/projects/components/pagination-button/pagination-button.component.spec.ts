import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginationButtonComponent } from './pagination-button.component';

describe('PaginationButtonComponent', () => {
  let component: PaginationButtonComponent;
  let fixture: ComponentFixture<PaginationButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaginationButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginationButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
