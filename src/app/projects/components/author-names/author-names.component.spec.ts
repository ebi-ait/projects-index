import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorNamesComponent } from './author-names.component';

describe('AuthorNamesComponent', () => {
  let component: AuthorNamesComponent;
  let fixture: ComponentFixture<AuthorNamesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AuthorNamesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorNamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
