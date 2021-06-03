import { TestBed } from '@angular/core/testing';

import { HttpErrorInterceptor } from './http-error.interceptor';
import { RouterTestingModule } from '@angular/router/testing';

describe('HttpErrorInterceptor', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [HttpErrorInterceptor],
      imports: [RouterTestingModule]
    })
  );

  it('should be created', () => {
    const interceptor: HttpErrorInterceptor =
      TestBed.inject(HttpErrorInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
