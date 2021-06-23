import { Component, OnInit } from '@angular/core';
import { HeadingService } from './services/heading.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(private headingService: HeadingService) {}

  showBreadcrumbs$: Observable<boolean>;
  currentLocation$: Observable<string>;

  ngOnInit() {
    this.showBreadcrumbs$ = this.headingService.showBreadcrumbs$;
    this.currentLocation$ = this.headingService.currentLocation$;
  }
}
