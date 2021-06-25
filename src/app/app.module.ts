import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GlobalHeaderComponent } from './components/global-header/global-header.component';
import { AboutComponent } from './pages/about/about.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { HttpClientModule } from '@angular/common/http';
import { ProjectsModule } from './projects/projects.module';
import { ErrorsModule } from './errors/errors.module';
import { AddProjectComponent } from './pages/add-project/add-project.component';
import { NavComponent } from './components/nav/nav.component';
import { VisualFrameworkModule } from './visual-framework/visual-framework.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    GlobalHeaderComponent,
    AboutComponent,
    FeedbackComponent,
    AddProjectComponent,
    NavComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ProjectsModule,
    VisualFrameworkModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ErrorsModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
