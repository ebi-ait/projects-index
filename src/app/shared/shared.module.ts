import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChevronComponent } from './components/chevron/chevron.component';
import { ExternalLinkComponent } from './components/external-link/external-link.component';

@NgModule({
  declarations: [ChevronComponent, ExternalLinkComponent],
  imports: [CommonModule],
  exports: [ChevronComponent, ExternalLinkComponent],
})
export class SharedModule {}
