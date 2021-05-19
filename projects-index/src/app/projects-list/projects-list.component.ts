import { Component, OnInit } from '@angular/core';
import {ProjectsService} from "../projects.service";

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.css']
})
export class ProjectsListComponent implements OnInit {
  projects: object[];
  displayProjects: object[];
  recentProjectsFirst: boolean = true;
  organs: string[];
  technologies: string[];
  filterState = {organ: "", technology: "", dataLocation: ""};

  constructor(private projectService: ProjectsService) {
  }

  ngOnInit(): void {
    this.projectService.getProjects().subscribe(projects => {
      console.log("fetched data");
      this.projects = projects;
      this.displayProjects = projects.sort(this.sortByDate());
      this.populateOrgans();
      this.populateTechnologies();
    });
  }

  populateOrgans() {
    this.organs = [...new Set(this.projects.map(project => project.organs).flat())].sort();
  }

  populateTechnologies() {
    this.technologies = [...new Set(this.projects.map(project => project.technologies).flat())].sort();
  }

  toggleDateSort() {
    this.recentProjectsFirst = !this.recentProjectsFirst;
    this.displayProjects.sort(this.sortByDate(this.recentProjectsFirst));
  }

  private sortByDate(desc= true) {
    return function (a,b) {
      return desc ?  b.addedToIndex - a.addedToIndex: a.addedToIndex - b.addedToIndex;
    };
  }

  applyFilters() {
    this.displayProjects = this.projects
      .filter(project => this.filters.organ ? project.organs.includes(this.filters.organ) : true)
      .filter(project => this.filters.technology ? project.technologies.includes(this.filters.technology) : true);

    if (this.filters.dataLocation === "HCA Data Portal")
      this.displayProjects = this.displayProjects.filter(project => !!project["dcpUrl"]);
    else if (this.filters.dataLocation === "GEO")
      this.displayProjects = this.displayProjects.filter(project => project["geoAccessions"]?.length);
    else if (this.filters.dataLocation === "ArrayExpress")
      this.displayProjects = this.displayProjects.filter(project => project["arrayExpressAccessions"]?.length);
    else if (this.filters.dataLocation === "ENA")
      this.displayProjects = this.displayProjects.filter(project => project["enaAccessions"]?.length);
    else if (this.filters.dataLocation === "EGA")
      this.displayProjects = this.displayProjects.filter(project => project["egaStudiesAccessions"]?.length || project["egaDatasetsAccessions"]?.length)

    this.displayProjects.sort(this.sortByDate(this.recentProjectsFirst));
  }

   filterByTechnology($selectedTechnology: string) {
    this.filters.technology = $selectedTechnology ?? "";
    this.applyFilters();
   }

  filterByOrgan($selectedOrgan: string) {
    this.filters.organ = $selectedOrgan ?? "";
    this.applyFilters();
  }

  // resetDisplayProjects() {
  //   this.displayProjects = this.projects;
  //   //todo: ask Gabs if we want the sorting to be retained in these cases
  //   this.displayProjects.sort(this.sortByDate(this.recentProjectsFirst));
  // }

  private filterByLocation($selectedLocation: string) {
    this.filters.dataLocation = $selectedLocation ?? "";
    this.applyFilters();
  }
}
