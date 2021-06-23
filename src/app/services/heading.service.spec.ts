import { TestBed } from '@angular/core/testing';

import { HeadingService } from './heading.service';

describe('HeadingServiceService', () => {
  let service: HeadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
