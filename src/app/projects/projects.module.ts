import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsListComponent } from './projects-list/projects-list.component';
import { AuthorNamesComponent } from './components/author-names/author-names.component';
import { FiltersComponent } from './components/filters/filters.component';
import { ProjectsRoutingModule } from './projects-routing.module';
import { PaginationComponent } from './components/pagination/pagination.component';

@NgModule({
  declarations: [ProjectsListComponent, AuthorNamesComponent, FiltersComponent, PaginationComponent],
  imports: [CommonModule, ProjectsRoutingModule],
})
export class ProjectsModule {}
