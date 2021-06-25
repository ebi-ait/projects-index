import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HeadingService {
  private title = new BehaviorSubject<string>('HCA Project Catalogue');
  title$ = this.title.asObservable();
  private subtitle = new BehaviorSubject<string>('');
  subtitle$ = this.subtitle.asObservable();
  private showAboutLink = new BehaviorSubject<boolean>(false);
  showAboutLink$ = this.showAboutLink.asObservable();
  private showBreadcrumbs = new BehaviorSubject<boolean>(false);
  showBreadcrumbs$ = this.showBreadcrumbs.asObservable();
  private currentLocation = new BehaviorSubject<string>('');
  currentLocation$ = this.currentLocation.asObservable();

  constructor() {}

  setTitle(title: string, subtitle = '', showAboutLink = false) {
    this.title.next(title);
    this.subtitle.next(subtitle);
    this.showAboutLink.next(showAboutLink);
  }

  setBreadcrumbs(currentLocation: string) {
    this.currentLocation.next(currentLocation);
    this.showBreadcrumbs.next(true);
  }

  hideBreadcrumbs() {
    this.showBreadcrumbs.next(false);
  }
}
