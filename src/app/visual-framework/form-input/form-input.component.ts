import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { BaseFormInputComponent } from '../base-form-input/base-form-input.component';

@Component({
  selector: 'app-form-input',
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.css'],
})
export class FormInputComponent extends BaseFormInputComponent {
  @Input() label: string;
  @Input() value: string;
  @Input() placeholder = '';

  disabled = false;
  @ViewChild('input') input: ElementRef;
}
