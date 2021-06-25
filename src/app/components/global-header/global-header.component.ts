import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { HeadingService } from '../../services/heading.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-global-header',
  templateUrl: './global-header.component.html',
  styleUrls: ['./global-header.component.css'],
})
export class GlobalHeaderComponent implements OnInit {
  constructor(private router: Router, private headingService: HeadingService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && event.url) {
        this.activatedRoute = event.url;
      }
    });
  }

  activatedRoute = '';
  headerTitle$: Observable<string>;
  headerText$: Observable<string>;
  showAboutLink$: Observable<boolean>;

  ngOnInit(): void {
    this.headerTitle$ = this.headingService.title$;
    this.headerText$ = this.headingService.subtitle$;
    this.showAboutLink$ = this.headingService.showAboutLink$;
  }
}
