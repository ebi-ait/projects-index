import { Component, OnInit } from '@angular/core';
import {ProjectsService} from "../projects.service";

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.css']
})
export class ProjectsListComponent implements OnInit {
  projects: object[]
  recentProjectsFirst:boolean = true

  constructor(private projectService: ProjectsService) {}

  ngOnInit(): void {
    this.projectService.getProjects().subscribe(projects => {
      console.log("fetched data");
      this.projects = projects.sort(this.sortByDate());
    });
  }

  toggleDateSort() {
    this.recentProjectsFirst = !this.recentProjectsFirst;
    this.projects.sort(this.sortByDate(this.recentProjectsFirst));
  }

  private sortByDate(desc= true) {
    return function (a,b) {
      return desc ?  b.addedToIndex - a.addedToIndex: a.addedToIndex - b.addedToIndex;
    };
  }
}
