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
  filterState = {organ: "", technology: "", dataLocation: "", recentProjectsFirst: true, searchText: ""};

  constructor(private projectService: ProjectsService) {
  }

  ngOnInit(): void {
    this.projectService.getProjects().subscribe(projects => {
      // console.log("fetched data: ", data);
      this.projects = projects;
      console.log("fetched data: ", projects);
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

  applyFilters() {

    this.displayProjects.sort(this.sortByDate(this.filterState.recentProjectsFirst));

    this.displayProjects = this.projects
      .filter(project => this.filterState.organ ? project?.["organs"].includes(this.filterState.organ) : true)
      .filter(project => this.filterState.technology ? project?.["technologies"].includes(this.filterState.technology) : true);

    if (this.filterState.dataLocation === "HCA Data Portal")
      this.displayProjects = this.displayProjects.filter(project => !!project["dcpUrl"]);
    else if (this.filterState.dataLocation === "GEO")
      this.displayProjects = this.displayProjects.filter(project => project["geoAccessions"]?.length);
    else if (this.filterState.dataLocation === "ArrayExpress")
      this.displayProjects = this.displayProjects.filter(project => project["arrayExpressAccessions"]?.length);
    else if (this.filterState.dataLocation === "ENA")
      this.displayProjects = this.displayProjects.filter(project => project["enaAccessions"]?.length);
    else if (this.filterState.dataLocation === "EGA")
      this.displayProjects = this.displayProjects.filter(project => project["egaStudiesAccessions"]?.length || project["egaDatasetsAccessions"]?.length)

    // for search bb:
    // these two titles were coming up in dev, but not in my local, why? Is it because of the transformation on the author names?
    //
    // Single-cell RNA-seq of human peripheral blood NKT cells
    // Transcriptomic characterisation of haematopoietic stem and progenitor cells from human adult bone marrow, spleen and peripheral blood

    // also the search cross doesn't work rn
    this.displayProjects = this.displayProjects.filter(project => this.tranformProjectToString(project).includes(this.filterState.searchText.toLowerCase()));

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

   filterByTechnology($selectedTechnology: string) {
    this.filterState.technology = $selectedTechnology ?? "";
    this.applyFilters();
   }

  filterByOrgan($selectedOrgan: string) {
    this.filterState.organ = $selectedOrgan ?? "";
    this.applyFilters();
  }

  // resetDisplayProjects() {
  //   this.displayProjects = this.projects;
  //   //todo: ask Gabs if we want the sorting to be retained in these cases
  //   this.displayProjects.sort(this.sortByDate(this.recentProjectsFirst));
  // }

  private filterByLocation($selectedLocation: string) {
    this.filterState.dataLocation = $selectedLocation ?? "";
    this.applyFilters();
  }

  private search($search: string) {
      this.filterState.searchText = $search;
      this.applyFilters();
  }
}
