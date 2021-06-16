import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GlobalHeaderComponent } from './components/global-header/global-header.component';
import { AboutComponent } from './about/about.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { HttpClientModule } from '@angular/common/http';
import { ProjectsModule } from './projects/projects.module';
import { WINDOW_PROVIDERS } from './services/window.provider';
import { ExternalLinkComponent } from './shared/components/external-link/external-link.component';

@NgModule({
  declarations: [
    AppComponent,
    GlobalHeaderComponent,
    AboutComponent,
    FeedbackComponent,
    ExternalLinkComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, ProjectsModule],
  providers: [WINDOW_PROVIDERS],
  bootstrap: [AppComponent],
})
export class AppModule {}
