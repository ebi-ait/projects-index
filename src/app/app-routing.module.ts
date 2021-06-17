import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { AddProjectComponent } from './add-project/add-project.component';

const routes: Routes = [
  { path: 'about', component: AboutComponent },
  { path: 'add-project', component: AddProjectComponent },
  {
    path: '',
    loadChildren: () =>
      import('./projects/projects.module').then((m) => m.ProjectsModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
