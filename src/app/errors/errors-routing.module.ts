import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ErrorServerComponent } from "./error-server/error-server.component";
import { ErrorNotFoundComponent } from "./error-not-found/error-not-found.component";
import { ErrorJavascriptComponent } from "./error-javascript/error-javascript.component";
import { ErrorGeneralComponent } from "./error-general/error-general.component";

const routes: Routes = [
  { path: '500', component: ErrorServerComponent },
  { path: '404', component: ErrorNotFoundComponent },
  { path: 'js', component: ErrorJavascriptComponent },
  { path: '', component: ErrorGeneralComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ErrorsRoutingModule {}
