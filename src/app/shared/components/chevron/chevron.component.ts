import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-chevron',
  templateUrl: './chevron.component.svg',
  styleUrls: ['./chevron.component.css'],
})
export class ChevronComponent implements OnInit {
  @Input() up = false;

  constructor() {}

  ngOnInit(): void {}
}
