import { AbstractControl, FormControl, FormGroup, FormArray } from '@angular/forms';
import { Feature } from '../../submission-shared/model';

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

export function featureGroupSize(g: Feature[]) {
  return g.map(f => f.rowSize()).reduce((rv, v) => rv + v, 0);
}
