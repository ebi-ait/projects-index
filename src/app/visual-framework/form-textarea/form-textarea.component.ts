import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseFormInputComponent } from '../base-form-input/base-form-input.component';

@Component({
  selector: 'app-form-textarea',
  templateUrl: './form-textarea.component.html',
  styleUrls: ['./form-textarea.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: FormTextareaComponent,
    },
  ],
})
export class FormTextareaComponent extends BaseFormInputComponent {
  @Input() required = false;
  @Input() label: string;
  @Input() value: string;

  disabled = false;
  @ViewChild('textArea') input: ElementRef;
}
