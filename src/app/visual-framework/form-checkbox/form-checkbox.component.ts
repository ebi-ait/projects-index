import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { BaseFormInputComponent } from '../base-form-input/base-form-input.component';
import { ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-form-checkbox',
  templateUrl: './form-checkbox.component.html',
  styleUrls: ['./form-checkbox.component.css'],
})
export class FormCheckboxComponent
  extends BaseFormInputComponent
  implements OnInit
{
  @Input() required = false;
  @Input() value: string;

  disabled = false;
  @ViewChild('checkbox') input: ElementRef;

  validate(): ValidatorFn[] {
    const validators: ValidatorFn[] = [];
    if (this.required) {
      validators.push(Validators.requiredTrue);
    }

    return validators;
  }
}
