import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AboutComponent} from "./about/about.component";
import {ProjectsListComponent} from "./projects-list/projects-list.component";


const routes: Routes = [
  {path: 'home', component: ProjectsListComponent},
  {path: '', component: ProjectsListComponent},
  {path: 'about', component: AboutComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
