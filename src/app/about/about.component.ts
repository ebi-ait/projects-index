import { Component } from '@angular/core';
import { environment } from '../../environments/environment';
import { HeadingService } from '../services/heading.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent {
  constructor(private headingService: HeadingService) {
    this.headingService.setTitle(
      'Aims, eligibility criteria and selection process',
      'A comprehensive list of cellular resolution datasets for the Human Cell Atlas.'
    );
    this.headingService.setBreadcrumbs('About');
  }

  wranglerEmail: string = environment.wranglerEmail;
}
