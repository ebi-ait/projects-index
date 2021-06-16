import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsListComponent } from './projects-list/projects-list.component';
import { AuthorNamesComponent } from './components/author-names/author-names.component';
import { FiltersComponent } from './components/filters/filters.component';
import { ProjectsService } from './projects.service';
import { ProjectsRoutingModule } from './projects-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [ProjectsListComponent, AuthorNamesComponent, FiltersComponent],
  providers: [ProjectsService],
  imports: [CommonModule, ProjectsRoutingModule, SharedModule],
})
export class ProjectsModule {}
