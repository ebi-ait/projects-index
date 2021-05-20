import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProjectsListComponent } from './projects-list/projects-list.component';
import { GlobalHeaderComponent } from './global-header/global-header.component';
import { AboutComponent } from './about/about.component';
import { FeedbackComponent } from './feedback/feedback.component';
import {HttpClientModule} from "@angular/common/http";
import { AuthorNamesComponent } from './author-names/author-names.component';
import { FiltersComponent } from './filters/filters.component';
import { SearchFilterPipe } from './search-filter.pipe';
import { SearchComponent } from './search/search.component';

@NgModule({
  declarations: [
    AppComponent,
    ProjectsListComponent,
    GlobalHeaderComponent,
    AboutComponent,
    FeedbackComponent,
    AuthorNamesComponent,
    FiltersComponent,
    SearchFilterPipe,
    SearchComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
