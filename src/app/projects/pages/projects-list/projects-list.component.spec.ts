import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsListComponent } from './projects-list.component';
import { ProjectsService } from '../../projects.service';
import { FiltersComponent } from '../../components/filters/filters.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { WINDOW_PROVIDERS } from 'src/app/shared/services/window.provider';

describe('ProjectsListComponent', () => {
  let component: ProjectsListComponent;
  let fixture: ComponentFixture<ProjectsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProjectsService, WINDOW_PROVIDERS, AnalyticsService],
      declarations: [ProjectsListComponent, FiltersComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
