import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  routes = [
    {
      url: '',
      text: 'Home',
    },
    {
      url: '/about',
      text: 'About',
    },
    {
      url: '/add-project',
      text: 'Add a project',
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
