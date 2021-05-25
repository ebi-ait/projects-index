import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AboutComponent} from "./about/about.component";


const routes: Routes = [
  {path: 'about', component: AboutComponent },
  {
    path: '',
    loadChildren: () => import('./projects/projects.module').then(m => m.ProjectsModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes.concat())],
  exports: [RouterModule]
})
export class AppRoutingModule {}
