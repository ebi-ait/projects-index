import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, switchMap, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaginatedProjects, Project } from '../project';

interface Filters {
  organ: string;
  technology: string;
  location: string;
  searchVal: string;
  recentFirst: boolean;
}

@Injectable()
export class ProjectsService implements OnDestroy {
  static allowedLocations = {
    HCA: 'HCA Data Portal',
    GEO: 'GEO',
    ARRAY_EXPRESS: 'ArrayExpress',
    ENA: 'ENA',
    EGA: 'EGA',
    DBGAP: 'dbGaP',
  } as const;

  private URL = `${environment.ingestApiUrl}${environment.catalogueEndpoint}`;

  private projectsPerPage = 20;
  private currentPage: BehaviorSubject<number>;

  private availableTechnologies: string[];
  private availableOrgans: string[];

  private filters: BehaviorSubject<Filters>;
  currentFilters: Filters;

  private pagedProjects = new Subject<PaginatedProjects>();
  pagedProjects$ = this.pagedProjects.asObservable();

  private filteredProjects = new Subject<Project[]>();
  filteredProjects$ = this.filteredProjects.asObservable();

  constructor(private http: HttpClient) {
    this.filters = new BehaviorSubject<Filters>({
      organ: '',
      technology: '',
      location: '',
      searchVal: '',
      recentFirst: true,
    });
    this.filters.subscribe((filters) => {
      this.currentFilters = filters;
    });

    this.currentPage = new BehaviorSubject(1);

    this.changePage(1);
    this.setFilters({
      organ: '',
      technology: '',
      location: '',
      searchVal: '',
      recentFirst: true,
    });

    this.retrieveProjects();
  }

  ngOnDestroy(): void {
    this.pagedProjects.complete();
    this.filteredProjects.complete();
    this.currentPage.complete();
    this.filters.complete();
  }

  private retrieveProjects(): void {
    this.getAllProjects()
      .pipe(
        tap((projects) => {
          this.availableOrgans = [
            ...new Set(projects.map((project) => project.organs).flat()),
          ].sort() as string[];

          this.availableTechnologies = [
            ...new Set(projects.map((project) => project.technologies).flat()),
          ].sort() as string[];
        }),
        switchMap((projects: Project[]) =>
          this.filters.pipe(
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
        tap((projects: Project[]) => this.filteredProjects.next(projects)),
        switchMap((projects: Project[]) =>
          this.currentPage.pipe(
            map((currentPage) => {
              const paginatedProjects = projects.slice(
                (currentPage - 1) * this.projectsPerPage,
                currentPage * this.projectsPerPage
              );

              return {
                items: paginatedProjects,
                currentPage,
                itemsPerPage: this.projectsPerPage,
                totalItems: projects.length,
                availableOrgans: this.availableOrgans,
                availableTechnologies: this.availableTechnologies,
              };
            })
          )
        )
      )
      .subscribe(
        (projects) => this.pagedProjects.next(projects),
        (error) => this.pagedProjects.error(error)
      );
  }

  changePage(page: number) {
    this.currentPage.next(page);
  }

  setFilters(filters: Filters) {
    if (
      filters.location &&
      !ProjectsService.allowedLocations.includes(filters.location)
    ) {
      console.error(`${filters.location} not an allowed data location.`);
      return;
    }
    this.filters.next(filters);
    this.changePage(1);
  }

  public getAllProjects(): Observable<Project[]> {
    return this.http.get<any>(this.URL).pipe(
      map((response) => {
        if (response) {
          return response._embedded.projects
            .map(this.formatProject)
            .filter((project) => !!project);
        }
      })
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
      case ProjectsService.allowedLocations.HCA:
        if (!project.dcpUrl) {
          return false;
        }
        break;
      case ProjectsService.allowedLocations.GEO:
        if (!project.geoAccessions.length) {
          return false;
        }
        break;
      case ProjectsService.allowedLocations.ARRAY_EXPRESS:
        if (!project.arrayExpressAccessions.length) {
          return false;
        }
        break;
      case ProjectsService.allowedLocations.ENA:
        if (!project.enaAccessions.length) {
          return false;
        }
        break;
      case ProjectsService.allowedLocations.EGA:
        if (
          !(
            !!project.egaStudiesAccessions.length ||
            !!project.egaDatasetsAccessions.length
          )
        ) {
          return false;
        }
        break;
      case ProjectsService.allowedLocations.DBGAP:
        if (!project.dbgapAccessions.length) {
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

  private formatDate = (timestamp) =>
    new Date(timestamp).toLocaleDateString('en-gb', {
      timeZone: 'utc',
    });

  isWrangler = (contributor) =>
    contributor.project_role?.ontology === environment.wranglerOntology;

  private captureRegexGroups = (regex: RegExp, strings: string[]) =>
    strings
      .map((str) => regex.exec(str))
      .filter((match) => match && match.length)
      .map((match) => match[1]);

  private formatProject = (obj: any): Project => {
    try {
      return {
        uuid: obj.uuid.uuid,
        dcpUrl:
          obj.wranglingState === 'Published in DCP' &&
          `https://data.humancellatlas.org/explore/projects/${obj.uuid.uuid}`,
        addedToIndex: obj.cataloguedDate,
        date: obj.cataloguedDate ? this.formatDate(obj.cataloguedDate) : '-',
        title:
          obj.content.project_core.project_title ||
          (() => {
            throw new Error('No title');
          })(),
        organs:
          obj.organ?.ontologies?.map((organ) => organ.ontology_label) ?? [],
        technologies:
          obj.technology?.ontologies?.map((tech) => tech.ontology_label) ?? [],
        cellCount: obj.cellCount,
        // Temp fix until ena accessions fixed in core
        enaAccessions: (() => {
          const accessions = obj.content?.insdc_project_accessions;
          if (typeof accessions === 'string') {
            return [accessions];
          }
          return accessions ?? [];
        })(),
        geoAccessions: obj.content.geo_series_accessions ?? [],
        arrayExpressAccessions: obj.content.array_express_accessions ?? [],
        egaStudiesAccessions: this.captureRegexGroups(
          /(EGAS\d*)/i,
          obj.content.ega_accessions || []
        ),
        egaDatasetsAccessions: this.captureRegexGroups(
          /(EGAD\d*)/i,
          obj.content.ega_accessions || []
        ),
        dbgapAccessions: obj.content.dbgap_accessions ?? [],
        publications: obj.publicationsInfo ?? [],
        authors:
          obj.content.contributors
            ?.filter((c) => !this.isWrangler(c))
            .map((author) => {
              let formattedName = '';
              let fullName = '';
              if (author.hasOwnProperty('name')) {
                const names = author.name.split(',');
                formattedName = `${
                  names[names.length - 1]
                } ${names[0][0].toUpperCase()}`;
                fullName = author.name;
              } else if (author.hasOwnProperty('last')) {
                formattedName = author.last;
                fullName = author.last;
              }
              return {
                fullName,
                formattedName,
              };
            }) || [],
      };
    } catch (e) {
      console.error(`Error in project ${obj.uuid.uuid}: ${e.message}`);
      return null;
    }
  };
}
