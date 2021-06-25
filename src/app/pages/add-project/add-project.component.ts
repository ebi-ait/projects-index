import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HeadingService } from '../../services/heading.service';
import { AddProjectService } from './add-project.service';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css'],
})
export class AddProjectComponent {
  wranglerEmail = environment.wranglerEmail;
  submitted = false;
  error = false;
  constructor(
    private headingService: HeadingService,
    private addProjectService: AddProjectService
  ) {
    this.headingService.setTitle(
      'Suggest a project',
      'For inclusion in the HCA project catalogue'
    );
    this.headingService.setBreadcrumbs('Suggest a project');
  }

  onSubmit(f): void {
    // TODO Implement sending of data here
    console.log(f);
    this.addProjectService
      .submitProject(f)
      .then(() => {
        this.submitted = true;
      })
      .catch((e) => {
        console.error(e);
        this.error = true;
      });
  }

  reset(): void {
    this.submitted = false;
    this.error = false;
  }
}
