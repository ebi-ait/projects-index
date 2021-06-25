import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { BaseFormInputComponent } from '../base-form-input/base-form-input.component';

@Component({
  selector: 'app-form-textarea',
  templateUrl: './form-textarea.component.html',
  styleUrls: ['./form-textarea.component.css'],
})
export class FormTextareaComponent extends BaseFormInputComponent {
  @Input() required = false;
  @Input() label: string;
  @Input() value: string;

  disabled = false;
  @ViewChild('textArea') input: ElementRef;
}
