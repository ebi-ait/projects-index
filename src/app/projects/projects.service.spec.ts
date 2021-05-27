import { TestBed } from '@angular/core/testing';

import { ProjectsService } from './projects.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import testIngestProjects from './projects.service.spec.data.json';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProjectsService],
    });
    service = TestBed.inject(ProjectsService);
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a list of correctly formatted projects', () => {
    const firstProject = testIngestProjects._embedded.projects[0];
    service.getProjects().subscribe((projects) => {
      const project = projects[0];
      const props = [
        'uuid',
        'dcpUrl',
        'addedToIndex',
        'date',
        'title',
        'organs',
        'technologies',
        'enaAccessions',
        'geoAccessions',
        'arrayExpressAccessions',
        'egaStudiesAccessions',
        'egaDatasetsAccessions',
        'publications',
        'authors',
      ];
      props.forEach((prop) => {
        expect(project.hasOwnProperty(prop)).toBeTruthy();
      });

      project.authors.forEach((author) => {
        expect(author.hasOwnProperty('fullName')).toBeTruthy();
        expect(author.hasOwnProperty('formattedName')).toBeTruthy();
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
  });

  it('should return an HTTP error', () => {
    service.getProjects().subscribe(
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
});
