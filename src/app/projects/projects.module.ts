import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsListComponent } from './pages/projects-list/projects-list.component';
import { AuthorNamesComponent } from './components/author-names/author-names.component';
import { FiltersComponent } from './components/filters/filters.component';
import { ProjectsRoutingModule } from './projects-routing.module';
import { PaginationComponent } from './components/pagination/pagination.component';
import { PaginationButtonComponent } from './components/pagination-button/pagination-button.component';
import { ProjectsService} from "./projects.service";
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    ProjectsListComponent,
    AuthorNamesComponent,
    FiltersComponent,
    PaginationComponent,
    PaginationButtonComponent,
  ],
  imports: [CommonModule, ProjectsRoutingModule, SharedModule],
  providers: [ProjectsService]
})
export class ProjectsModule {}
