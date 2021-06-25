import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {Project} from "../projects/project";
import {ProjectCount, SummaryService} from "./summary.service";
import {ProjectsService} from "../projects/services/projects.service";

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SummaryComponent implements OnInit {

  projects$: Observable<Project[]>;
  projectsByOrgan$: Observable<ProjectCount[]>;
  projectsByTech$: Observable<ProjectCount[]>;
  cellCount$: Observable<number>;
  constructor(private projectService: ProjectsService,
              private summaryService: SummaryService
  ) {
  }

  ngOnInit(): void {
    this.projects$ = this.projectService.getAllProjects();
    this.projectsByOrgan$ = this.summaryService.projectsByOrgan$;
    this.projectsByTech$ = this.summaryService.projectsByTech$;
    this.cellCount$ = this.summaryService.cellCount$;
  }

}
