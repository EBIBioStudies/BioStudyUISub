import { AbstractControl, FormControl, FormGroup, FormArray } from '@angular/forms';
import { flatMap } from 'app/utils/array.utils';

export function controlToList(control: AbstractControl): FormControl[] {
  if (control instanceof FormGroup) {
    const map = (control as FormGroup).controls;
    const controls = Object.keys(map).map((key) => map[key]);

    return flatMap(controls, (controlItem) => controlToList(controlItem));
  } else if (control instanceof FormArray) {
    const array = (control as FormArray).controls;

    return flatMap(array, (controlItem) => controlToList(controlItem));
  }

  return [control as FormControl];
}
