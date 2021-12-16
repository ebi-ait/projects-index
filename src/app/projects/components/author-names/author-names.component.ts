import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-author-names',
  templateUrl: './author-names.component.html',
  styleUrls: ['./author-names.component.css'],
})
export class AuthorNamesComponent {
  @Input()
  authors: string[];

  fullAuthorView = false;

  constructor() {}

  toggleAuthorView() {
    this.fullAuthorView = !this.fullAuthorView;
  }

  getFormattedContributors() {
    return this.fullAuthorView
      ? this.authors.join(', ')
      : `${this.authors[0]} et. al.`;
  }
}
