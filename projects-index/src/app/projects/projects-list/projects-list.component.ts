import { Component, OnInit } from '@angular/core';
import {ProjectsService} from '../projects.service';
import { Project } from "../project";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { map, switchMap } from "rxjs/operators";

interface Filters {
  organ: string;
  technology: string;
  location: string;
  searchVal: string;
}

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.css']
})
export class ProjectsListComponent implements OnInit {
  projects: Project[];
  projects$: Observable<Project[]>;
  filters: BehaviorSubject<Filters>;
  displayProjects: object[];
  recentProjectsFirst: boolean = true;
  organs: string[];
  technologies: string[];

  constructor(private projectService: ProjectsService) {
  }

  ngOnInit(): void {
    this.projectService.getProjects().subscribe(projects => {
      this.projects = projects;
      this.displayProjects = projects.sort(this.sortByDate());
      this.populateOrgans();
      this.populateTechnologies();
    });

    this.filters = new BehaviorSubject<Filters>({
      organ: "",
      technology: "",
      location: "",
      searchVal: ""
    });

    this.projects$ = this.projectService.getProjects().pipe(
      switchMap(projects => this.filters.pipe(
        map(filters => projects.filter(project => this.filterProject(project, filters)))
      ))
    );
  }

  private filterProject(project, filters: Filters) {
    if (filters.organ && !project.organs.includes(filters.organ)) { return false; }
    if (filters.technology && !project.technologies.includes(filters.technology)) { return false; }

    switch (filters.location) {
      case "HCA Data Portal":
        if (!project.dcpUrl) { return false; }
        break;
      case "GEO":
        if (!project.geoAccessions.length) { return false; }
        break;
      case "ArrayExpress":
        if (!project.arrayExpressAccessions.length) { return false; }
        break;
      case "ENA":
        if (!project.enaAccessions.length) { return false; }
        break;
      case "EGA":
        if (!(!!project.egaStudiesAccessions.length || !!project.egaDatasetsAccessions.length)) { return false; }
        break;
      default:
        break;
    }

    const toSearch = [
      project.authors.join(", "), // This might be wrong. Might need to search contributor names to have surname
      project.uuid,
      project.title,
      project.arrayExpressAccessions.join(" "),
      project.geoAccessions.join(" "),
      project.egaDatasetsAccessions.join(" "),
      project.egaStudiesAccessions.join(" "),
      project.enaAccessions.join(" "),
      project.organs.join(" "),
      project.technologies.join(" ")
      ].map(x => x.toLowerCase()).join(" ");

    return toSearch.includes(filters.searchVal);
  }

  populateOrgans() {
    this.organs = [...new Set(this.projects.map(project => project.organs).flat())].sort();
  }

  populateTechnologies() {
    this.technologies = [...new Set(this.projects.map(project => project.technologies).flat())].sort();
  }

  toggleDateSort() {
    // this.recentProjectsFirst = !this.recentProjectsFirst;
    this.filterState.recentProjectsFirst = !this.filterState.recentProjectsFirst;
    this.applyFilters();
    // this.displayProjects.sort(this.sortByDate(this.recentProjectsFirst));
  }

  private sortByDate(desc= true) {
    return function (a,b) {
      return desc ?  b.addedToIndex - a.addedToIndex: a.addedToIndex - b.addedToIndex;
    };
  }

  private tranformProjectToString(project): string {
      let x = [
      project["authors"].join(", ").trim(),
      project["uuid"],
      project["title"].trim(),
      project["enaAccessions"].join(" ").trim(),
      project["arrayExpressAccessions"].join(" ").trim(),
      project["egaStudiesAccessions"].join(" ").trim(),
      project["egaDatasetsAccessions"].join(" ").trim(),
      project["geoAccessions"].join(" ").trim(),
      project["organs"].join(" ").trim(),
      project["technologies"].join(" ").trim()
    ].join(" ").trim().toLowerCase();

    if (project["uuid"] === "f48e7c39-cc67-4055-9d79-bc437892840c" || project["uuid"] === "455b46e6-d8ea-4611-861e-de720a562ada" ) {
      console.log(x);
    }
    return x;
  }

   filterByTechnology($selectedTechnology: string = "") {
    this.filters.next({
      ...this.filters.getValue(),
      technology: $selectedTechnology
    });
   }

  filterByOrgan($selectedOrgan: string = "") {
    this.filters.next({
      ...this.filters.getValue(),
      organ: $selectedOrgan
    });
  }

  // resetDisplayProjects() {
  //   this.displayProjects = this.projects;
  //   //todo: ask Gabs if we want the sorting to be retained in these cases
  //   this.displayProjects.sort(this.sortByDate(this.recentProjectsFirst));
  // }

  private filterByLocation($selectedLocation: string = "") {
    this.filters.next({
      ...this.filters.getValue(),
      location: $selectedLocation
    });
  }

  private search($search: string = "") {
    this.filters.next({
      ...this.filters.getValue(),
      searchVal: $search
    });
  }
}
