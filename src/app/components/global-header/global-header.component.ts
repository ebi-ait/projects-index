import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-global-header',
  templateUrl: './global-header.component.html',
  styleUrls: ['./global-header.component.css'],
})
export class GlobalHeaderComponent implements OnInit {
  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && event.url) {
        this.activatedRoute = event.url;
      }
    });
  }

  ngOnInit(): void {}

  activatedRoute = '';
  showAboutLink = true;

  get headerTitle() {
    if (this.activatedRoute.includes('about')) {
      return 'About the Catalogue';
    }

    return 'HCA Project Catalogue';
  }

  get headerText() {
    if (this.activatedRoute.includes('about')) {
      this.showAboutLink = false;
      return 'Aims, eligibility criteria and selection process';
    }

    this.showAboutLink = true;
    return 'A comprehensive list of cellular resolution datasets for the Human Cell Atlas.';
  }
}
