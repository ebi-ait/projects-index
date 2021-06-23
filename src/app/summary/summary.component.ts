import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {ProjectsService} from "../projects/projects.service";
import {Project} from "../projects/project";

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SummaryComponent implements OnInit {

  projects$: Observable<Project[]>;
  constructor(private projectService: ProjectsService
  ) {
  }

  ngOnInit(): void {
    this.getProjects();
  }

  getProjects() {
    this.projects$ = this.projectService.getAllProjects();
  }


}
