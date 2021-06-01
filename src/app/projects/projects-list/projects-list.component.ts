import { Component, OnInit } from '@angular/core';
import { ProjectsService } from '../projects.service';
import { Project } from '../project';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

interface Filters {
  organ: string;
  technology: string;
  location: string;
  searchVal: string;
  recentFirst: boolean;
}

interface Pagination {
  itemsPerPage: number;
  currentPage: number;
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

  private pagination: BehaviorSubject<Pagination>;
  currentPage$: Observable<number>;
  totalPages: number;

  constructor(private projectService: ProjectsService) {}

  ngOnInit(): void {
    this.filters = new BehaviorSubject<Filters>({
      organ: '',
      technology: '',
      location: '',
      searchVal: '',
      recentFirst: true,
    });

    this.pagination = new BehaviorSubject<Pagination>({
      itemsPerPage: 20,
      currentPage: 1
    });

    this.currentPage$ = this.pagination.pipe(map(({currentPage}) => currentPage));

    this.pagination.subscribe(() => {
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    });

    this.projects$ = this.projectService.getProjects().pipe(
      switchMap((projects: Project[]) =>
        this.filters.pipe(
          tap(() => {
            this.populateOrgans(projects);
            this.populateTechnologies(projects);
            this.totalProjects = projects.length;
            this.totalPages = Math.ceil(projects.length / this.pagination.getValue().itemsPerPage);
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
      ),
      switchMap((projects: Project[]) =>
        this.pagination.pipe(
          map(({ itemsPerPage, currentPage}) => {
            const startIndex = Math.min(itemsPerPage * (currentPage - 1), projects.length - itemsPerPage);
            console.log(startIndex);
            return projects.slice(startIndex, startIndex + itemsPerPage);
          })
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
    this.organs = ((
      [...new Set(projects.map((project) => project.organs).flat())].sort()
    ) as string[]);
  }

  populateTechnologies(projects): void {
    this.technologies = ((
      [
        ...new Set(projects.map((project) => project.technologies).flat()),
      ].sort()
    ) as string[]);
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

  changePage($pageNumber: number): void {
    if ((($pageNumber - 1) * this.pagination.getValue().itemsPerPage) > this.totalProjects) { return; }

    this.pagination.next({
      ...this.pagination.getValue(),
      currentPage: $pageNumber
    });
  }
}
