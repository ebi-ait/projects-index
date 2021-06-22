import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProjectsService } from '../projects.service';
import { PaginatedProjects } from '../project';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { PaginationEvent } from '../components/pagination/pagination.component';

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
  organs: string[];
  technologies: string[];
  wranglerEmail: string = environment.wranglerEmail;

  constructor(
    private projectService: ProjectsService,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit(): void {
    this.projectService.projects$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((paginatedProjects) => {
        this.projects = paginatedProjects;
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
}
