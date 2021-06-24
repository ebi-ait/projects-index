import { Injectable } from '@angular/core';
import { Octokit } from '@octokit/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AddProjectService {
  octokit: any;
  githubRepo = 'ebi-ait/hca-ebi-wrangler-central';
  constructor() {
    this.octokit = new Octokit({ auth: environment.gh_pat });
  }

  async submitProject({ doi, email, contactName, comments }) {
    return await this.octokit.request(`POST /repos/${this.githubRepo}/issues`, {
      owner: 'octocat',
      repo: 'hello-world',
      title: `Project Catalogue Submission: ${doi}`,
      labels: ['Project Catalogue Submission', 'dataset'],
      body: `A new project has been submitted to the project catalogue!

- Publication DOI/Project URL: ${doi},
- Contact name: ${contactName}
- Contact email: ${email}
- Comments: ${comments}
      `,
    });
  }
}
