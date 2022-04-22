import { Component, Input, OnInit } from '@angular/core';
import { Link } from '../../project';

@Component({
  selector: 'list-of-links',
  templateUrl: './list-of-links.component.html',
  styleUrls: ['./list-of-links.component.css'],
})
export class ListOfLinksComponent implements OnInit {
  @Input()
  name: string;

  @Input()
  links: Link[];

  constructor() {}

  ngOnInit(): void {}
}
