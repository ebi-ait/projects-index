import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Project } from '../../../projects/project';
import { ProjectCount, SummaryService } from '../../services/summary.service';
import { ProjectsService } from '../../../projects/services/projects.service';
import { HeadingService } from '../../../services/heading.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css'],
  providers: [SummaryService, ProjectsService],
})
export class SummaryComponent implements OnInit {
  projects$: Observable<Project[]>;
  projectsByOrgan$: Observable<ProjectCount[]>;
  projectsByTech$: Observable<ProjectCount[]>;
  cellCount$: Observable<number>;

  constructor(
    private projectService: ProjectsService,
    private summaryService: SummaryService,
    private headingService: HeadingService
  ) {
    this.headingService.setTitle('Summary', 'Projects Summary Statistics');
    this.headingService.setBreadcrumbs('Summary');
  }

  ngOnInit(): void {
    this.projects$ = this.projectService.getAllProjects();
    this.projectsByOrgan$ = this.summaryService.projectsByOrgan$;
    this.projectsByTech$ = this.summaryService.projectsByTech$;
    this.cellCount$ = this.summaryService.cellCount$;
  }
}
