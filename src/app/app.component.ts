import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

  isAboutPage(): boolean {
    var url = window.location.href;
    var lastPart = url.substr(url.lastIndexOf('/') + 1);

    return lastPart === "about" ?? false
  }
}
