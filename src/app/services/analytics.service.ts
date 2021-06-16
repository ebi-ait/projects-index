import { Inject, Injectable } from '@angular/core';
import { Project } from '../projects/project';
import { WINDOW } from '../shared/services/window.provider';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  window: Window;

  constructor(@Inject(WINDOW) window: Window) {
    this.window = window;
  }

  pushSearchTerms($search: string, projects: Project[]): void {
    const LIMIT = 5;

    this.window['dataLayer'].push({
      event: 'search_projects',
      search_term: $search,
      search_projects_term_and_uuids: `term: ${$search}, results: ${projects
        .slice(0, LIMIT)
        .map((dataPoint) => dataPoint.uuid)
        .join(',')}`,
      search_projects_term_and_titles: `term: ${$search}, results: ${projects
        .slice(0, LIMIT)
        .map((dataPoint) => dataPoint.title)
        .join(',')}`,
    });
  }
}
