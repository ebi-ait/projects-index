import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalErrorService } from './global-error.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpErrorInterceptor } from './http-error.interceptor';
import { ErrorsRoutingModule } from './errors-routing.module';
import { ErrorServerComponent } from './error-server/error-server.component';
import { ErrorNotFoundComponent } from './error-not-found/error-not-found.component';
import { ErrorGeneralComponent } from './error-general/error-general.component';
import { ContactSupportComponent } from './components/contact-support/contact-support.component';



@NgModule({
  declarations: [ErrorServerComponent, ErrorNotFoundComponent, ErrorGeneralComponent, ContactSupportComponent],
  imports: [CommonModule, ErrorsRoutingModule],
  providers: [
    {
      // processes all errors
      provide: ErrorHandler,
      useClass: GlobalErrorService
    },
    {
      // interceptor for HTTP errors
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true // multiple interceptors are possible
    }
  ]
})
export class ErrorsModule { }
