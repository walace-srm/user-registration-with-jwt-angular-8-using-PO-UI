import { FormGroup, AbstractControl, FormArray } from '@angular/forms';

export function markFormAsDirty(form: FormGroup) {
    Object.keys(form.controls).forEach(key => {
      markControlAsDirty(form.controls[key]);
    });
  }
  
  export function markControlAsDirty(control: AbstractControl) {
    control.markAsDirty();
  
    if (control instanceof FormGroup) {
      markFormAsDirty(control);
    } else if (control instanceof FormArray) {
      control.controls.forEach(element => markControlAsDirty(element));
    }
  }