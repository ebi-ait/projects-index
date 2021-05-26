import { Component, Input, OnInit } from '@angular/core';
import { Author } from "../../project";

@Component({
  selector: 'app-author-names',
  templateUrl: './author-names.component.html',
  styleUrls: ['./author-names.component.css'],
})
export class AuthorNamesComponent implements OnInit {
  @Input()
  authors: Author[];

  fullAuthorView: boolean = false;
  formattedNames: string[];

  constructor() {}

  ngOnInit(): void {
    this.formattedNames = this.authors.map(author => author.formattedName);
  }

  toggleAuthorView() {
    this.fullAuthorView = !this.fullAuthorView;
  }

  getFormattedContributors() {
    return this.fullAuthorView ? this.formattedNames : `${this.formattedNames[0]} et. al.`;
  }
}
