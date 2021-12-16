import { TestBed } from '@angular/core/testing';

import { ProjectsService } from './projects.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import testIngestProjects from './projects.service.spec.data.json';
import testIngestProjectWithoutNameField from './projects.service.spec.data_with_no_contributors_name_field.json';

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
    const firstProject = testIngestProjects._embedded.projects[0];
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
        'egaStudiesAccessions',
        'egaDatasetsAccessions',
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
    req.flush(testIngestProjects);
    sub.unsubscribe();
  });

  it('each author should be a string containing a space', () => {
    const sub = service.pagedProjects$.subscribe((projects) => {
      expect(projects.items.length).toBeGreaterThan(0);

      const project = projects.items[0];

      expect(project).not.toBeNull();

      project.authors.forEach((author) => {
        expect(author).toEqual(jasmine.any(String));
        expect(author).toContain(' ');
      });
    });

    const req = httpTestingController.expectOne(
      `${environment.ingestApiUrl}${environment.catalogueEndpoint}`
    );
    expect(req.request.method).toEqual('GET');
    req.flush(testIngestProjectWithoutNameField);
    sub.unsubscribe();
  });

  it('should return an HTTP error', () => {
    service.pagedProjects$.subscribe(
      (project) => {},
      (error) => {
        expect(error).toBeTruthy();
        expect(error.message).toContain('400 bad request');
      }
    );

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

      expect(project).not.toBeNull();

      expect(project.cellCount).toEqual(1000);
    });

    const req = httpTestingController.expectOne(
      `${environment.ingestApiUrl}${environment.catalogueEndpoint}`
    );
    expect(req.request.method).toEqual('GET');
    req.flush(testIngestProjectWithoutNameField);
    sub.unsubscribe();
  });

});
