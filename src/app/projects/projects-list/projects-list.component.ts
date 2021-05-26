import { Component, OnInit } from '@angular/core';
import { ProjectsService } from '../projects.service';
import { Project } from '../project';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, startWith, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

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
  styleUrls: ['./projects-list.component.css'],
})
export class ProjectsListComponent implements OnInit {
  projects$: Observable<Project[]>;
  totalProjects: number;
  filters: BehaviorSubject<Filters>;
  organs: string[];
  technologies: string[];
  wranglerEmail: string = environment.wranglerEmail;

  constructor(private projectService: ProjectsService) {}

  ngOnInit(): void {
    this.filters = new BehaviorSubject<Filters>({
      organ: '',
      technology: '',
      location: '',
      searchVal: '',
      recentFirst: true,
    });

    this.projects$ = this.projectService.getProjects().pipe(
      switchMap((projects: Project[]) =>
        this.filters.pipe(
          tap(() => {
            this.populateOrgans(projects);
            this.populateTechnologies(projects);
            this.totalProjects = projects.length;
          }),
          map((filters: Filters) =>
            projects
              .filter((project: Project) =>
                this.filterProject(project, filters)
              )
              .sort((a, b) => {
                if (filters.recentFirst) {
                  return a.addedToIndex <= b.addedToIndex ? 1 : -1;
                }
                return a.addedToIndex <= b.addedToIndex ? -1 : 1;
              })
          )
        )
      )
    );
  }

  private filterProject(project, filters: Filters): boolean {
    if (filters.organ && !project.organs.includes(filters.organ)) {
      return false;
    }
    if (
      filters.technology &&
      !project.technologies.includes(filters.technology)
    ) {
      return false;
    }
    switch (filters.location) {
      case 'HCA Data Portal':
        if (!project.dcpUrl) {
          return false;
        }
        break;
      case 'GEO':
        if (!project.geoAccessions.length) {
          return false;
        }
        break;
      case 'ArrayExpress':
        if (!project.arrayExpressAccessions.length) {
          return false;
        }
        break;
      case 'ENA':
        if (!project.enaAccessions.length) {
          return false;
        }
        break;
      case 'EGA':
        if (
          !(
            !!project.egaStudiesAccessions.length ||
            !!project.egaDatasetsAccessions.length
          )
        ) {
          return false;
        }
        break;
      default:
        break;
    }

    const toSearch = [
      project.authors.map((author) => author.fullName).join(', '),
      project.uuid,
      project.title,
      project.arrayExpressAccessions.join(' '),
      project.geoAccessions.join(' '),
      project.egaDatasetsAccessions.join(' '),
      project.egaStudiesAccessions.join(' '),
      project.enaAccessions.join(' '),
      project.organs.join(' '),
      project.technologies.join(' '),
    ]
      .map((x) => x.toLowerCase())
      .join(' ');

    const searchKeywords = filters.searchVal.toLowerCase().split(' ');
    return searchKeywords.every((keyword) => toSearch.includes(keyword));
  }

  populateOrgans(projects): void {
    this.organs = <string[]>(
      [...new Set(projects.map((project) => project.organs).flat())].sort()
    );
  }

  populateTechnologies(projects): void {
    this.technologies = <string[]>(
      [
        ...new Set(projects.map((project) => project.technologies).flat()),
      ].sort()
    );
  }

  toggleDateSort(): void {
    const currentValues = this.filters.getValue();
    this.filters.next({
      ...currentValues,
      recentFirst: !currentValues.recentFirst,
    });
  }

  filterByTechnology($selectedTechnology: string = ''): void {
    this.filters.next({
      ...this.filters.getValue(),
      technology: $selectedTechnology,
    });
  }

  filterByOrgan($selectedOrgan: string = ''): void {
    this.filters.next({
      ...this.filters.getValue(),
      organ: $selectedOrgan,
    });
  }

  // resetDisplayProjects() {
  //   this.displayProjects = this.projects;
  //   //todo: ask Gabs if we want the sorting to be retained in these cases
  //   this.displayProjects.sort(this.sortByDate(this.recentProjectsFirst));
  // }

  filterByLocation($selectedLocation: string = ''): void {
    this.filters.next({
      ...this.filters.getValue(),
      location: $selectedLocation,
    });
  }

  search($search: string = ''): void {
    this.filters.next({
      ...this.filters.getValue(),
      searchVal: $search,
    });
  }
}
