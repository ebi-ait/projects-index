import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-author-names',
  templateUrl: './author-names.component.html',
  styleUrls: ['./author-names.component.css']
})
export class AuthorNamesComponent implements OnInit {
  @Input()
  authors: string[]

  @Input()
  test: string

  fullAuthorView:boolean = false

  constructor() { }

  ngOnInit(): void {}


  toggleAuthorView() {
    this.fullAuthorView = !this.fullAuthorView;
  }

  getFormattedContributors() {
    return this.fullAuthorView ? this.authors : `${this.authors[0]} et. al.`
  }

}
