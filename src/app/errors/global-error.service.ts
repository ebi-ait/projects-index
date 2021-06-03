import { ErrorHandler, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class GlobalErrorService implements ErrorHandler {
  constructor(private router: Router) {}

  handleError(error: Error) {
    this.router.navigate(['/error']);
  }
}
