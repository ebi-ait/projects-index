import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-button',
  template: `
    <button
      class="vf-button"
      [ngClass]="{
        'vf-button--primary': primary,
        'vf-button--secondary': secondary && !primary,
        'vf-button--sm': small,
        'vf-button--tertiary': disabled
      }"
      [disabled]="disabled"
    >
      <ng-content></ng-content>
    </button>
  `,
  styleUrls: ['./button.component.css'],
})
export class ButtonComponent implements OnInit {
  @Input() primary = false;
  @Input() secondary = true;
  @Input() small = false;
  @Input() disabled = false;

  constructor() {}

  ngOnInit(): void {}
}
