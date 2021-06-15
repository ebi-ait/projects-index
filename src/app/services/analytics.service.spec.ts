import { TestBed } from '@angular/core/testing';

import { AnalyticsService } from './analytics.service';
import { WINDOW_PROVIDERS } from './window.provider';

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WINDOW_PROVIDERS, AnalyticsService]
    });
    service = TestBed.inject(AnalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
