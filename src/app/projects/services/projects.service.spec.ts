import { TestBed } from '@angular/core/testing';

import { ProjectsService } from './projects.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import testIngestProjects from './projects.service.spec.data.json';
import cloneDeep from 'lodash/cloneDeep';

/**
 * Generates a sample list of 1 project to provide to the service
 * @param mapper (optional) function that receives the sample project and returns a new project. Used to edit the project
 */
const makeInputData = (mapper?) => {
  let project = cloneDeep(testIngestProjects);
  if (mapper) {
    project = mapper(project);
  }
  return {
    _embedded: {
      projects: [project],
    },
  };
};

describe('ProjectsService', () => {
  let service: ProjectsService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  beforeEach(() => {
    service = new ProjectsService(httpClient);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should return a list of correctly formatted projects', () => {
    const data = makeInputData();
    const firstProject = data._embedded.projects[0];
    const sub = service.pagedProjects$.subscribe((projects) => {
      const project = projects.items[0];
      const props = [
        'uuid',
        'dcpUrl',
        'addedToIndex',
        'date',
        'title',
        'organs',
        'technologies',
        'cellCount',
        'enaAccessions',
        'geoAccessions',
        'arrayExpressAccessions',
        'egaAccessions',
        'dbgapAccessions',
        'publications',
        'authors',
      ];
      props.forEach((prop) => {
        expect(project.hasOwnProperty(prop)).toBeTruthy();
      });

      project.authors.forEach((author) => {
        expect(author).toEqual(jasmine.any(String));
      });

      project.publications.forEach((publication) => {
        const pubProps = ['doi', 'url', 'journalTitle', 'title', 'authors'];
        pubProps.forEach((prop) => {
          expect(publication.hasOwnProperty(prop)).toBeTruthy();
        });
      });

      expect(project.uuid).toEqual(firstProject.uuid.uuid);
    });

    const req = httpTestingController.expectOne(
      `${environment.ingestApiUrl}${environment.catalogueEndpoint}`
    );
    expect(req.request.method).toEqual('GET');
    req.flush(data);
    sub.unsubscribe();
  });

  it('each author should be a string containing a space', () => {
    const sub = service.pagedProjects$.subscribe((projects) => {
      expect(projects.items.length).toBeGreaterThan(0);

      const project = projects.items[0];

      expect(project).toBeDefined();

      project.authors.forEach((author) => {
        expect(author).toEqual(jasmine.any(String));
        expect(author).toContain(' ');
      });
    });

    const req = httpTestingController.expectOne(
      `${environment.ingestApiUrl}${environment.catalogueEndpoint}`
    );
    expect(req.request.method).toEqual('GET');
    req.flush(makeInputData());
    sub.unsubscribe();
  });

  it('should return an HTTP error', () => {
    service.pagedProjects$.subscribe({
      next: () => {},
      error: (error) => {
        expect(error).toBeTruthy();
        expect(error.message).toContain('400 bad request');
      },
    });

    const req = httpTestingController.expectOne(
      `${environment.ingestApiUrl}${environment.catalogueEndpoint}`
    );
    expect(req.request.method).toEqual('GET');
    req.flush(null, { status: 400, statusText: 'bad request' });
  });

  it('should return the cell count from project metadata', () => {
    const sub = service.pagedProjects$.subscribe((projects) => {
      expect(projects.items.length).toBeGreaterThan(0);

      const project = projects.items[0];

      expect(project).toBeDefined();

      expect(project.cellCount).toEqual(1000);
    });

    const req = httpTestingController.expectOne(
      `${environment.ingestApiUrl}${environment.catalogueEndpoint}`
    );
    expect(req.request.method).toEqual('GET');
    req.flush(makeInputData());
    sub.unsubscribe();
  });

  it('should allow no publicationsInfo', () => {
    spyOn(console, 'error');

    const sub = service.pagedProjects$.subscribe((projects) => {
      expect(projects.items.length).toBeGreaterThan(0);

      const project = projects.items[0];

      expect(project).toBeDefined();

      expect(console.error).not.toHaveBeenCalledWith(
        jasmine.stringMatching(/authors/)
      );
      expect(project.authors).toEqual([]);
    });

    const req = httpTestingController.expectOne(
      `${environment.ingestApiUrl}${environment.catalogueEndpoint}`
    );
    expect(req.request.method).toEqual('GET');

    const noPublicationsInfo = makeInputData((project) => {
      delete project.publicationsInfo;
      return project;
    });

    req.flush(noPublicationsInfo);
    sub.unsubscribe();
  });

  it('should allow empty publicationsInfo', () => {
    spyOn(console, 'error');

    const sub = service.pagedProjects$.subscribe((projects) => {
      expect(projects.items.length).toBeGreaterThan(0);

      const project = projects.items[0];

      expect(project).toBeDefined();

      expect(console.error).not.toHaveBeenCalledWith(
        jasmine.stringMatching(/authors/)
      );
      expect(project.authors).toEqual([]);
    });

    const req = httpTestingController.expectOne(
      `${environment.ingestApiUrl}${environment.catalogueEndpoint}`
    );
    expect(req.request.method).toEqual('GET');

    const emptyPublicationsInfo = makeInputData((project) => {
      project.publicationsInfo = [];
      return project;
    });

    req.flush(emptyPublicationsInfo);
    sub.unsubscribe();
  });

  it('should not allow no title', () => {
    spyOn(console, 'error');

    const sub = service.pagedProjects$.subscribe((projects) => {
      expect(projects.items.length).toEqual(0);

      expect(console.error).toHaveBeenCalledWith(
        jasmine.stringMatching(/title/)
      );
    });

    const req = httpTestingController.expectOne(
      `${environment.ingestApiUrl}${environment.catalogueEndpoint}`
    );
    expect(req.request.method).toEqual('GET');

    const noTitle = makeInputData((project) => {
      delete project.content.project_core.project_title;
      return project;
    });
    req.flush(noTitle);
    sub.unsubscribe();
  });

  it('should allow no authors', () => {
    const sub = service.pagedProjects$.subscribe((projects) => {
      const project = projects.items[0];
      expect(project).toBeDefined();
      expect(project.authors).toEqual([]);
    });

    const req = httpTestingController.expectOne(
      `${environment.ingestApiUrl}${environment.catalogueEndpoint}`
    );

    expect(req.request.method).toEqual('GET');

    const noAuthors = makeInputData((project) => {
      delete project.publicationsInfo[0].authors;
      return project;
    });
    req.flush(noAuthors);
    sub.unsubscribe();
  });
});
