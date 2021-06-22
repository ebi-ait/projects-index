import {
  Component,
  ElementRef,
  Input,
  OnInit,
  Self,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NgControl,
  Validator,
  ValidatorFn,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-base-form-input',
  template: ` <p>base-form-input works!</p> `,
  styleUrls: ['./base-form-input.component.css'],
})
export class BaseFormInputComponent
  implements OnInit, ControlValueAccessor, Validator {
  disabled = false;
  @ViewChild('input') input: ElementRef;
  @Input() name: string;
  @Input() required = false;
  @Input() pattern: RegExp;

  constructor(@Self() public controlDir: NgControl) {
    this.controlDir.valueAccessor = this;
  }

  ngOnInit(): void {
    const control = this.controlDir.control;
    const validators = this.validate(control);

    control.setValidators(validators);
    control.updateValueAndValidity();
  }

  validate(c: AbstractControl): ValidatorFn[] {
    const validators: ValidatorFn[] = c.validator ? [c.validator] : [];
    if (this.required) {
      validators.push(Validators.required);
    }
    if (this.pattern) {
      validators.push(Validators.pattern(this.pattern));
    }

    return validators;
  }

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

  isInvalid(): boolean {
    return (
      this.controlDir &&
      !this.controlDir.control.valid &&
      this.controlDir.control.touched
    );
  }

  onChange(event) {}

  onTouched() {}
}
