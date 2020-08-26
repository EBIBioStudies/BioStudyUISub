import { AbstractControl, FormControl, FormGroup, FormArray } from '@angular/forms';

export function controlToList(control: AbstractControl): FormControl[] {
  if (control instanceof FormGroup) {
    const map = (control as FormGroup).controls;

    return Object.keys(map)
      .map(key => map[key])
      .flatMap((controlItem) => controlToList(controlItem));
  } else if (control instanceof FormArray) {
    const array = (control as FormArray).controls;

    return array.flatMap((controlItem) => controlToList(controlItem));
  }

  return [control as FormControl];
}
