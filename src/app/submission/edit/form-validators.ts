import {
    AbstractControl,
    AbstractControlOptions,
    AsyncValidatorFn,
    FormControl,
    FormGroup,
    ValidationErrors,
    ValidatorFn,
    Validators
} from '@angular/forms';
import {TextValueType, ValueType, ValueTypeName} from '../shared/model/templates';
import {Attribute, Feature, Field} from '../shared/model/submission';
import {parseDate} from '../../utils';

export class ControlRef {
    constructor(readonly id: string,
                readonly name: string = '',
                readonly parentRef?: ControlGroupRef,
                readonly icon: string = 'fa-square') {
    };

    get parentName(): string {
        return this.parentRef ? this.parentRef.name : '';
    }

    get sectionId(): string {
        return this.parentRef ? this.parentRef.sectionId : '';
    }

    get sectionName(): string {
        return this.parentRef ? this.parentRef.sectionName : '';
    }

    static unknown = new ControlRef('unknown_control', 'unknown');
}

export class ControlGroupRef {
    constructor(
        readonly sectionId: string,
        readonly sectionName: string,
        readonly featureName?: string,
        readonly icon: string = 'fa-square') {
    };

    get name(): string {
        return this.featureName || this.sectionName;
    }

    featureRef(feature: Feature) {
        return new ControlGroupRef(this.sectionId, this.sectionName, feature.typeName, feature.type.icon);
    }

    fieldRef(field: Field) {
        return this.create(field.id, field.name, field.type.icon);
    };

    columnRef(column: Attribute) {
        return this.create(column.id, 'Column');
    };

    rowValueRef(column: Attribute, rowId: string) {
        return this.create(column.id + '#' + rowId, column.name);
    };

    private create(id: string, name: string, icon?: string) {
        const parentName = this.featureName || this.sectionName;
        const uniqueId = [parentName, id].join('_');
        return new ControlRef(uniqueId, name, this, icon || this.icon);
    }

    static unknown = new ControlGroupRef('unknown_section', 'unknown');
}

export class MyFormControl extends FormControl {
    ref: ControlRef = ControlRef.unknown;

    constructor(formState?: any,
                validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
                asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null) {
        super(formState, validatorOrOpts, asyncValidator);
    }

    withRef(ref: ControlRef): MyFormControl {
        this.ref = ref;
        return this;
    }

    static compareBySectionId = (c1: FormControl, c2: FormControl) => {
        if (c1 instanceof MyFormControl && c2 instanceof MyFormControl) {
            return c1.ref.sectionId.localeCompare(c2.ref.sectionId);
        } else if (c1 instanceof  MyFormControl) {
            return 1;
        } else if (c2 instanceof  MyFormControl) {
            return -1;
        }
        return 0;
    };
}

export class MyFormGroup extends FormGroup {
    ref: ControlGroupRef = ControlGroupRef.unknown;

    constructor(controls: { [p: string]: AbstractControl },
                validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
                asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null) {
        super(controls, validatorOrOpts, asyncValidator);
    }

    withRef(ref: ControlGroupRef): MyFormGroup {
        this.ref = ref;
        return this;
    }
}

export class FormValidators {
    static uniqueValues: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
        const columns = <FormGroup> control;
        const values = Object.keys(columns.controls)
            .map(key => <FormControl>columns.controls[key])
            .map(c => c.value);

        const valueCounts = values
            .filter(v => !v.isEmpty())
            .reduce((rv, v) => {
                rv[v] = (rv[v] || 0) + 1;
                return rv;
            }, {});

        const duplicates = values.filter(v => valueCounts[v] > 1);
        if (duplicates.isEmpty()) {
            return null;
        }

        Object.keys(columns.controls).forEach(key => {
            const control = columns.controls[key];
            let errors = control.errors;
            if (duplicates.includes(control.value)) {
                errors = errors || {};
                errors['unique'] = {value: control.value};
            } else if (errors !== null) {
                delete errors['unique'];
                if (Object.keys(errors).length === 0) {
                    errors = null;
                }
            }
            control.setErrors(errors);
        });
        return {'unique': {value: duplicates[0]}};
    };

    static formatDate: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
        return parseDate(control.value) !== undefined ? null : {'format': {value: control.value}};
    };

    static formatOrcid: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
        return /^\d{4}-\d{4}-\d{4}-\d{4}$/.test(control.value) ? null : {'format': {value: control.value}};
    };
}

export class SubmFormValidators {
    static forValueType(valueType: ValueType): ValidatorFn[] {
        const validators: ValidatorFn[] = [];

        if (valueType.is(ValueTypeName.text, ValueTypeName.largetext)) {
            const vt = <TextValueType>valueType;
            if (vt.maxlength > 0) {
                validators.push(Validators.maxLength(vt.maxlength));
            }
            if (vt.minlength > 0) {
                validators.push(Validators.minLength(vt.minlength));
            }
        } else if (valueType.is(ValueTypeName.date)) {
            validators.push(FormValidators.formatDate);
        }
        if (valueType.is(ValueTypeName.orcid)) {
            validators.push(FormValidators.formatOrcid);
        }
        return validators;
    }

    static forField(field: Field): ValidatorFn[] {
        const validators: ValidatorFn[] = [];
        if (field.type.displayType.isRequired) {
            validators.push(Validators.required);
        }
        return [...validators, ...SubmFormValidators.forValueType(field.type.valueType)];
    }

    static forCell(column: Attribute): ValidatorFn[] {
        const validators: ValidatorFn[] = [];
        if (column.displayType.isRequired) {
            validators.push(Validators.required);
        }
        return [...validators, ...SubmFormValidators.forValueType(column.valueType)];
    }

    static forColumn(column: Attribute): ValidatorFn[] {
        return [Validators.required];
    }

    static forFeatureColumns(feature: Feature) {
        const validators: ValidatorFn[] = [];
        if (feature.type.uniqueCols) {
            validators.push(FormValidators.uniqueValues);
        }
        return validators;
    }
}

export class CustomErrorMessages {
    static for(control: AbstractControl) {
        const ref = ((control instanceof MyFormControl) ? control.ref : undefined) || ControlRef.unknown;
        const groupRef = ((control instanceof MyFormGroup) ? control.ref : undefined) || ControlGroupRef.unknown;

        return {
            'required': (error: { value: string }) => {
                return `Please enter the ${ref.parentName}'s ${ref.name.toLowerCase()}`;
            },
            'minlength': (error: { requiredLength: number, actualLength: number }) => {
                return `Please use at least ${error.requiredLength} characters`;
            },
            'maxlength': (error: { requiredLength: number, actualLength: number }) => {
                return `Please use up to ${error.requiredLength} characters`;
            },
            'format': (error: any) => {
                return `Please provide a valid value`;
            },
            'unique': (error: { value: string }) => {
                return `${groupRef.name}'s ${error.value} column is not unique`;
            }
        };
    }
}

export class ErrorMessages {
    static map(control: AbstractControl): string[] {
        const errors = control.errors || {};
        const messages = CustomErrorMessages.for(control);
        return Object.keys(errors).map(errorKey => messages[errorKey](errors[errorKey]))
    }
}
