import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProjectComponent } from './add-project.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VisualFrameworkModule } from '../../visual-framework/visual-framework.module';

describe('AddProjectComponent', () => {
  let component: AddProjectComponent;
  let fixture: ComponentFixture<AddProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule, VisualFrameworkModule],
      declarations: [AddProjectComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
