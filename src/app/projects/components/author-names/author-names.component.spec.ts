import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AuthorNamesComponent } from './author-names.component';

describe('AuthorNamesComponent', () => {
  let component: AuthorNamesComponent;
  let fixture: ComponentFixture<AuthorNamesComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AuthorNamesComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorNamesComponent);
    component = fixture.componentInstance;
    component.authors = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
