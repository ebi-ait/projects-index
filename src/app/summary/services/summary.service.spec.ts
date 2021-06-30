import {TestBed} from '@angular/core/testing';

import {SummaryService} from './summary.service';
import {ProjectsService} from "../../projects/services/projects.service";
import {Observable, of} from "rxjs";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {Project} from "../../projects/project";
import {delay} from "rxjs/operators";
import {makeDummyProjects} from "./projects.data";


class MockProjectsService {
  getAllProjects() :Observable<Project[]>{
    return of(makeDummyProjects()).pipe(delay(1));
  }
}

describe('SummaryService', () => {
  let service: SummaryService;
  let mockProjectsService: ProjectsService;

  beforeEach(() => {

    TestBed.configureTestingModule({
                                     imports: [HttpClientTestingModule],
                                     providers: [
                                       SummaryService,
                                       {provide: ProjectsService, useClass: MockProjectsService}
                                     ]
                                   });

    service = TestBed.inject(SummaryService);
    mockProjectsService = TestBed.inject(ProjectsService);
  });

  it('should be created', () => {
    expect(service)
      .toBeTruthy();
  });

  it('should sum all projects', () => {
    service.cellCount$.subscribe(value => {
      expect(value)
        .toEqual(500);
    });
  });

  it('should group projects by tech', () => {
    service.projectsByTech$.subscribe(value => {
      expect(value)
        .toEqual([
                {group: 't1', count: 2, cellCount: 500},
                {group: 't2', count: 1, cellCount: 200},
                {group: 't3', count: 1, cellCount: 300},
              ]);
    });
  });

  it('should group projects by organ', () => {
    service.projectsByOrgan$.subscribe(value => {
      expect(value)
        .toEqual([
                {group: 'lungs', count: 2, cellCount: 500},
                {group: 'brain', count: 1, cellCount: 200},
                {group: 'kidney', count: 1, cellCount: 300},
              ]);
    });
  });
});
