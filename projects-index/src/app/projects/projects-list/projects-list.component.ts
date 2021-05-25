import { Component, OnInit } from '@angular/core';
import {ProjectsService} from '../projects.service';
import { Project } from "../project";
import { BehaviorSubject, Observable } from "rxjs";
import { map, switchMap } from "rxjs/operators";

interface Filters {
  organ: string;
  technology: string;
  location: string;
  searchVal: string;
  recentFirst: boolean;
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
  organs: string[];
  technologies: string[];

  constructor(private projectService: ProjectsService) {
  }

  ngOnInit(): void {
    this.projectService.getProjects().subscribe(projects => {
      this.projects = projects;
      this.populateOrgans();
      this.populateTechnologies();
    });

    this.filters = new BehaviorSubject<Filters>({
      organ: "",
      technology: "",
      location: "",
      searchVal: "",
      recentFirst: true
    });

    this.projects$ = this.projectService.getProjects().pipe(
      switchMap(projects => this.filters.pipe(
        map(filters =>
          projects
            .filter(project => this.filterProject(project, filters))
            .sort((a, b) => {
              if (filters.recentFirst) {
                return a.addedToIndex <= b.addedToIndex ? 1 : -1;
              }
              return a.addedToIndex <= b.addedToIndex ? -1 : 1;
            })
        )
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
    const currentValues = this.filters.getValue();
    this.filters.next({
      ...currentValues,
      recentFirst: !currentValues.recentFirst
    });
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
