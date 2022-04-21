import { TestBed } from '@angular/core/testing';

import { GlobalErrorService } from './global-error.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('GlobalErrorService', () => {
  let service: GlobalErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [GlobalErrorService],
    });
    service = TestBed.inject(GlobalErrorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
