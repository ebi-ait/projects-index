import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-contact-support',
  templateUrl: './contact-support.component.html',
  styleUrls: ['./contact-support.component.css'],
})
export class ContactSupportComponent implements OnInit {
  wranglerEmail: string;

  constructor() {}

  ngOnInit(): void {
    this.wranglerEmail = environment.wranglerEmail;
  }
}
