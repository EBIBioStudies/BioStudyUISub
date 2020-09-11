import { AbstractControl, FormControl, FormGroup, FormArray } from '@angular/forms';
import { flatMap } from 'app/utils';

export function controlToList(control: AbstractControl): FormControl[] {
  if (control instanceof FormGroup) {
    const map = (<FormGroup>control).controls;
    const controls = Object.keys(map).map((key) => map[key]);

    return flatMap(controls, (controlItem) => controlToList(controlItem));
  } else if (control instanceof FormArray) {
    const array = (<FormArray>control).controls;

    return flatMap(array, (controlItem) => controlToList(controlItem));
  }

  return [<FormControl>control];
}
