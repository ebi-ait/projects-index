import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseFormInputComponent } from '../base-form-input/base-form-input.component';

@Component({
  selector: 'app-form-input',
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: FormInputComponent,
    },
  ],
})
export class FormInputComponent extends BaseFormInputComponent {
  @Input() required = false;
  @Input() label: string;
  @Input() value: string;
  @Input() placeholder = '';

  disabled = false;
  @ViewChild('input') input: ElementRef;
}
