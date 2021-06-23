import { Component } from '@angular/core';
import { environment } from '../../environments/environment';
import { HeadingService } from '../services/heading.service';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css'],
})
export class AddProjectComponent {
  wranglerEmail = environment.wranglerEmail;
  submitted = false;
  constructor(private headingService: HeadingService) {
    this.headingService.setTitle(
      'Suggest a project',
      'For inclusion in the HCA project catalogue'
    );
    this.headingService.setBreadcrumbs('Suggest a project');
  }

  onSubmit(f): void {
    // TODO Implement sending of data here
    console.log(f);
    this.submitted = true;
  }

  reset(): void {
    this.submitted = false;
  }
}
