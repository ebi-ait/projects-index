import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormInputComponent } from './form-input/form-input.component';
import { FormTextareaComponent } from './form-textarea/form-textarea.component';
import { FormCheckboxComponent } from './form-checkbox/form-checkbox.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BaseFormInputComponent } from './base-form-input/base-form-input.component';
import { ButtonComponent } from './button/button.component';

@NgModule({
  declarations: [
    FormInputComponent,
    FormTextareaComponent,
    FormCheckboxComponent,
    BaseFormInputComponent,
    ButtonComponent,
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [
    FormInputComponent,
    FormTextareaComponent,
    FormCheckboxComponent,
    ButtonComponent,
  ],
})
export class VisualFrameworkModule {}
