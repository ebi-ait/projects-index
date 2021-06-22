import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { BaseFormInputComponent } from '../base-form-input/base-form-input.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-form-checkbox',
  templateUrl: './form-checkbox.component.html',
  styleUrls: ['./form-checkbox.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: FormCheckboxComponent,
    },
  ],
})
export class FormCheckboxComponent extends BaseFormInputComponent {
  @Input() required = false;
  @Input() value: string;

  disabled = false;
  @ViewChild('checkbox') input: ElementRef;

  onChange2(e) {
    console.log(e);
  }
}
