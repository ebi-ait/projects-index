import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WINDOW_PROVIDERS } from './services/window.provider';
import { ChevronComponent } from './components/chevron/chevron.component';
import { ExternalLinkComponent } from './components/external-link/external-link.component';

@NgModule({
  declarations: [ChevronComponent, ExternalLinkComponent],
  imports: [CommonModule],
  providers: [WINDOW_PROVIDERS, ChevronComponent, ExternalLinkComponent],
  exports: [ExternalLinkComponent, ChevronComponent],
})
export class SharedModule {}
