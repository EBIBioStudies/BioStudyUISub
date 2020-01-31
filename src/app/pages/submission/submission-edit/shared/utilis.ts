import { AbstractControl, FormControl, FormGroup, FormArray } from '@angular/forms';

export function controlToList(control: AbstractControl): FormControl[] {
  if (control instanceof FormGroup) {
    const map = (<FormGroup>control).controls;

    return Object.keys(map)
      .map(key => map[key])
      .flatMap((controlItem) => controlToList(controlItem));
  } else if (control instanceof FormArray) {
    const array = (<FormArray>control).controls;

    return array.flatMap((controlItem) => controlToList(controlItem));
  }

  return [<FormControl>control];
}
