import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProjectsService } from '../projects.service';
import { PaginatedProjects, Project } from '../project';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { PaginationEvent } from '../components/pagination/pagination.component';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.css'],
  // Don't want projects service to be a singleton since we shouldn't keep project data when not looking at ProjectsList
  // Hence, it is provided here and not in the module
  providers: [ProjectsService],
})
export class ProjectsListComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  projects: PaginatedProjects;
  filteredProjects: Project[];
  organs: string[];
  technologies: string[];
  wranglerEmail: string = environment.wranglerEmail;

  constructor(
    private projectService: ProjectsService,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit(): void {
    this.projectService.pagedProjects$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((paginatedProjects) => {
        this.projects = paginatedProjects;
      });
    this.projectService.filteredProjects$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((filteredProjects: Project[]) => {
        this.filteredProjects = filteredProjects;
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  toggleDateSort(): void {
    const currentValues = this.projectService.currentFilters;
    this.projectService.setFilters({
      ...currentValues,
      recentFirst: !currentValues.recentFirst,
    });
  }

  filterByTechnology($selectedTechnology: string = ''): void {
    this.projectService.setFilters({
      ...this.projectService.currentFilters,
      technology: $selectedTechnology,
    });
  }

  filterByOrgan($selectedOrgan: string = ''): void {
    this.projectService.setFilters({
      ...this.projectService.currentFilters,
      organ: $selectedOrgan,
    });
  }

  filterByLocation($selectedLocation: string = ''): void {
    this.projectService.setFilters({
      ...this.projectService.currentFilters,
      location: $selectedLocation,
    });
  }

  search($search: string = ''): void {
    this.projectService.setFilters({
      ...this.projectService.currentFilters,
      searchVal: $search,
    });

    this.analyticsService.pushSearchTerms($search, this.projects.items);
  }

  changePage(page: PaginationEvent) {
    this.projectService.changePage(page.currentPage);
  }

  saveSearchResultsAsTsv() {
    const columns = {
      uuid: 'Unique Key',
      date: 'Date added',
      title: 'Project Title',
      publications: 'Publications',
      authors: 'Authors',
      organs: 'Organs',
      technologies: 'Technologies',
      cellCount: 'Cell count',
      enaAccessions: 'ENA',
      arrayExpressAccessions: 'Arrayexpress',
      geoAccessions: 'GEO',
      egaStudiesAccessions: 'EGA',
      dcpUrl: 'HCA Data Portal URL'
    };
    const tsvArray = this.projectsAsTsvArray(this.filteredProjects, columns);
    const tsvString = tsvArray.join('\r\n');
    const blob = new Blob([tsvString], {type: 'text/tab-separated-values' });
    saveAs(blob, 'HcaCatalogueExport.tsv');
  }

  private projectsAsTsvArray(projects: Project[], columns: object) {
    const tsvArray = projects.map(
      (project: Project) => this.projectAsTsvString(project, Object.keys(columns))
    );
    tsvArray.unshift(Object.values(columns).join('\t'));
    return tsvArray;
  }

  private projectAsTsvString(project: Project, keys) {
    return keys.map(key => this.flattenProjectField(key, project[key])).join('\t');
  }

  private flattenProjectField(key: string, value) {
    if (!value && value !== 0) {
      return '';
    }
    if (key === 'authors') {
      return value.map(author => author.formattedName).join(', ');
    }
    if (key === 'publications') {
      return value.map(publication => `[${publication.journalTitle}](${publication.url})`).join(', ');
    }
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    return value;
  }
}
