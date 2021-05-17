import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProjectsListComponent } from './projects-list/projects-list.component';
import { GlobalHeaderComponent } from './global-header/global-header.component';
import { GlobalEbiMenuComponent } from './global-ebi-menu/global-ebi-menu.component';
import { AboutComponent } from './about/about.component';
import { FeedbackComponent } from './feedback/feedback.component';
import {HttpClientModule} from "@angular/common/http";
import { AuthorNamesComponent } from './author-names/author-names.component';

@NgModule({
  declarations: [
    AppComponent,
    ProjectsListComponent,
    GlobalHeaderComponent,
    GlobalEbiMenuComponent,
    AboutComponent,
    FeedbackComponent,
    AuthorNamesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
