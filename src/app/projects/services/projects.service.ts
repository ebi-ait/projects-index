import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, switchMap, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Link, PaginatedProjects, Project } from '../project';

interface Filters {
  organ: string;
  technology: string;
  location: string;
  searchVal: string;
  recentFirst: boolean;
  hcaBionetwork: string;
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
    cellxgene: 'cellxgene',
    SCEA: 'Single Cell Expression Atlas',
    UCSC: 'UCSC Cell Browser',
  } as const;

  private URL = `${environment.ingestApiUrl}${environment.catalogueEndpoint}`;

  private projectsPerPage = 20;
  private currentPage: BehaviorSubject<number>;

  private availableTechnologies: string[];
  private availableOrgans: string[];
  private availableHcaBionetworks: string[];

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
      hcaBionetwork: '',
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
      hcaBionetwork: '',
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

          this.availableHcaBionetworks = [
            ...new Set(
              projects
                .map((project) => {
                  return project.hca_bionetworks.map((network) => network.name);
                })
                .flat()
            ),
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
                availableHcaBionetworks: this.availableHcaBionetworks,
              };
            })
          )
        )
      )
      .subscribe({
        next: (projects) => this.pagedProjects.next(projects),
        error: (error) => this.pagedProjects.error(error),
      });
  }

  changePage(page: number) {
    this.currentPage.next(page);
  }

  setFilters(filters: Filters) {
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
    console.log(project.hca_bionetworks);
    debugger;
    if (
      filters.hcaBionetwork &&
      !project.hca_bionetworks
        .map((n) => n.name)
        .includes(filters.hcaBionetwork)
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
        if (!project.egaAccessions.length) {
          return false;
        }
        break;
      case ProjectsService.allowedLocations.DBGAP:
        if (!project.dbgapAccessions.length) {
          return false;
        }
        break;
      case ProjectsService.allowedLocations.cellxgene:
        if (!project.cellXGeneLinks.length) {
          return false;
        }
        break;
      case ProjectsService.allowedLocations.SCEA:
        if (!project.sceaLinks.length) {
          return false;
        }
        break;
      case ProjectsService.allowedLocations.UCSC:
        if (!project.ucscLinks.length) {
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
      project.enaAccessions.map((acc) => acc.name).join(' '),
      project.arrayExpressAccessions.map((acc) => acc.name).join(' '),
      project.geoAccessions.map((acc) => acc.name).join(' '),
      project.egaAccessions.map((acc) => acc.name).join(' '),
      project.dbgapAccessions.map((acc) => acc.name).join(' '),
      project.cellXGeneLinks.map((acc) => acc.name).join(' '),
      project.sceaLinks.map((acc) => acc.name).join(' '),
      project.ucscLinks.map((acc) => acc.name).join(' '),
      project.organs.join(' '),
      project.technologies.join(' '),
      project.publications.map((pub) => pub.journalTitle).join(' '),
    ]
      .map((x) => x.toLowerCase())
      .join(' ');

    const searchKeywords = filters.searchVal.toLowerCase().split(' ');
    return searchKeywords.every((keyword) => toSearch.includes(keyword));
  }

  formatProject = (obj: any): Project => {
    try {
      let project: Project = {
        uuid: obj.uuid.uuid,
        dcpUrl:
          obj.wranglingState === 'Published in DCP' &&
          `https://data.humancellatlas.org/explore/projects/${obj.uuid.uuid}`,
        addedToIndex: obj.cataloguedDate,
        date: obj.cataloguedDate
          ? ProjectsService.formatDate(obj.cataloguedDate)
          : '-',
        title:
          obj.content.project_core.project_title ||
          (() => {
            throw new Error('No title');
          })(),
        organs:
          obj.organ?.ontologies?.map((organ) => organ.ontology_label) ?? [],
        technologies:
          obj.technology?.ontologies?.map((tech) => tech.ontology_label) ?? [],
        // TODO: Remove usage of cellCount once the cellCount has been copied to content.estimated_cell_count
        // GH issue : https://github.com/ebi-ait/dcp-ingest-central/issues/445
        cellCount: obj.content.estimated_cell_count || obj.cellCount,
        enaAccessions: ProjectsService.enaAccessionLinks(
          obj.content?.insdc_project_accessions
        ),
        arrayExpressAccessions: ProjectsService.accessionLinks(
          obj.content.array_express_accessions ?? [],
          'https://identifiers.org/arrayexpress:'
        ),
        geoAccessions: ProjectsService.accessionLinks(
          obj.content.geo_series_accessions ?? [],
          'https://identifiers.org/geo:'
        ),
        egaAccessions: ProjectsService.egaAccessionLinks(
          obj.content.ega_accessions || []
        ),
        dbgapAccessions: ProjectsService.accessionLinks(
          obj.content.dbgap_accessions ?? [],
          'https://identifiers.org/dbgap:'
        ),
        cellXGeneLinks: [],
        sceaLinks: [],
        ucscLinks: [],
        publications: obj.publicationsInfo ?? [],
        authors: obj.publicationsInfo?.[0]?.authors || [],
        hca_bionetworks: obj.content.hca_bionetworks ?? [],
      };
      ProjectsService.addSupplementaryLinks(
        project,
        obj.content.supplementary_links ?? []
      );
      return project;
    } catch (e) {
      console.error(`Error in project ${obj.uuid.uuid}: ${e.message}`);
      return null;
    }
  };

  private static formatDate = (timestamp) =>
    new Date(timestamp).toLocaleDateString('en-gb', {
      timeZone: 'utc',
    });

  private static accessionLinks(
    accessions: any[],
    link_prefix: string
  ): Link[] {
    return accessions.map((accession) => ({
      name: accession,
      href: link_prefix.concat(accession),
    }));
  }

  private static enaAccessionLinks(ena_accessions: any): Link[] {
    if (typeof ena_accessions === 'string') {
      // Temp fix until ena accessions fixed in core
      ena_accessions = [ena_accessions];
    }
    return ProjectsService.accessionLinks(
      ena_accessions ?? [],
      'https://identifiers.org/ena.embl:'
    );
  }

  private static egaAccessionLinks(ega_accessions: any[]): Link[] {
    return ProjectsService.accessionLinks(
      this.captureRegexGroups(/(EGAS\d*)/i, ega_accessions),
      'https://ega-archive.org/studies/'
    ).concat(
      ProjectsService.accessionLinks(
        this.captureRegexGroups(/(EGAD\d*)/i, ega_accessions),
        'https://ega-archive.org/datasets/'
      )
    );
  }

  private static captureRegexGroups = (regex: RegExp, strings: string[]) =>
    strings
      .map((str) => regex.exec(str))
      .filter((match) => match && match.length)
      .map((match) => match[1]);

  private static addSupplementaryLinks(project: Project, links: string[]) {
    const cellxRegex =
      /^https?:\/\/cellxgene\.cziscience\.com\/collections\/(?<accession>[^;/?:@=&\s]+)(?:\/.*)*$/i;
    const sceaRegex =
      /^https?:\/\/www\.ebi\.ac\.uk\/gxa\/sc\/experiments\/(?<accession>[^;/?:@=&\s]+)\/results(?:\/tsne)?$/i;
    const ucscPostRegex =
      /^https?:\/\/(?:.*\.)?cells\.ucsc\.edu\/?\?(?:.*&)*ds=(?<accession>[^;\/?:@=&\s]+)(?:&.*)*$/i;
    const ucscPreRegex =
      /^https?:\/\/(?<accession>[^;\/?:@=&\s]+)\.cells\.ucsc\.edu\/?(?:\?.*)?$/i;

    links.forEach((link) => {
      let match = cellxRegex.exec(link);
      if (match) {
        project.cellXGeneLinks.push({
          name: match.groups.accession,
          href: link,
        });
      }
      match = sceaRegex.exec(link);
      if (match) {
        project.sceaLinks.push({
          name: match.groups.accession,
          href: link,
        });
      }
      match = ucscPostRegex.exec(link);
      if (!match) {
        match = ucscPreRegex.exec(link);
      }
      if (match) {
        project.ucscLinks.push({
          name: match.groups.accession,
          href: link,
        });
      }
    });
  }
}
