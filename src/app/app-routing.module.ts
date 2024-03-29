import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './pages/about/about.component';
import { AddProjectComponent } from './pages/add-project/add-project.component';
import { ErrorNotFoundComponent } from './errors/pages/error-not-found/error-not-found.component';
import { SummaryComponent } from './summary/pages/summary/summary.component';

const routes: Routes = [
  { path: 'about', component: AboutComponent },
  { path: 'add-project', component: AddProjectComponent },
  { path: 'summary', component: SummaryComponent },
  {
    path: 'error',
    loadChildren: () =>
      import('./errors/errors.module').then((m) => m.ErrorsModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('./projects/projects.module').then((m) => m.ProjectsModule),
  },
  { path: '**', component: ErrorNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
