import {AbstractControl, FormControl, FormGroup, ValidationErrors} from '@angular/forms';

export class CustomValidators {
    static required = (controlName: string, parentRef: string) => {
        return (control: AbstractControl): ValidationErrors | null => {
            if (typeof control.value !== 'string') {
                return null;
            } else if (control.value.isEmpty()) {
                return {'required': {value: control.value, controlName: controlName || '', controlParent: parentRef}};
            } else {
                return null;
            }
        };
    };

    static uniqueValues = (parentRef?: string) => {
        return (control: AbstractControl): ValidationErrors | null => {
            const columns = <FormGroup> control;
            const keys = Object.keys(columns.controls);

            const valueCounts = keys.map(key => <FormControl>columns.controls[key])
                .map(c => c.value)
                .filter(v => !(<string>v).isEmpty())
                .reduce((rv, v) => {
                    rv[v] = (rv[v] || 0) + 1;
                    return rv;
                }, {});

            let errorCount = 0;
            let nonUniqueValue: string = '';

            Object.keys(columns.controls).forEach(key => {
                const control = columns.controls[key];
                let errors = control.errors;
                if (valueCounts[control.value] > 1) {
                    errors = errors || {};
                    errors['unique'] = {controlValue: control.value, controlParent: parentRef};
                    errorCount += 1;
                    nonUniqueValue = control.value;
                } else if (errors !== null) {
                    delete errors['unique'];
                    if (Object.keys(errors).length === 0) {
                        errors = null;
                    }
                }
                control.setErrors(errors);
            });
            return errorCount === 0 ? null : {'unique': {controlValue: nonUniqueValue, controlParent: parentRef}}
        }
    };
};