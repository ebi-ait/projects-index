import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-base-form-input',
  template: ` <p>base-form-input works!</p> `,
  styleUrls: ['./base-form-input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: BaseFormInputComponent,
    },
  ],
})
export class BaseFormInputComponent implements OnInit, ControlValueAccessor {
  disabled = false;
  @ViewChild('input') input: ElementRef;
  @Input() name: string;
  constructor() {}

  ngOnInit(): void {}

  writeValue(obj: any): void {
    this.input.nativeElement.value = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onChange(event) {}

  onTouched() {}
}
