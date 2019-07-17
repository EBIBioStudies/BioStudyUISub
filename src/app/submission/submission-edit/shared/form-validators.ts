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
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { TextValueType, ValueType, ValueTypeName } from 'app/submission/submission-shared/model';
import { Attribute, Feature, Field, Section } from 'app/submission/submission-shared/model/submission';
import { parseDate } from 'app/utils';

// experimental: Control Reference details for using in error messages
export class ControlRef {
    static unknown = new ControlRef('unknown_control', 'unknown');

    constructor(readonly id: string,
                readonly name: string = '',
                readonly parentRef?: ControlGroupRef,
                readonly icon: string = 'fa-square') {
    }

    get parentName(): string {
        return this.parentRef ? this.parentRef.name : '';
    }

    get sectionId(): string {
        return this.parentRef ? this.parentRef.sectionId : '';
    }

    get sectionName(): string {
        return this.parentRef ? this.parentRef.sectionName : '';
    }

    get isRootSection(): boolean {
        return this.parentRef ? this.parentRef.isRoot : true;
    }
}

// experimental: Controls Groups Reference (for sections and features) for using in error list
export class ControlGroupRef {
    static unknown = new ControlGroupRef();

    readonly sectionId: string;
    readonly sectionName: string;
    readonly featureName?: string;
    readonly icon: string;
    readonly isRoot: boolean;

    static sectionRef(section: Section, isRoot: boolean = false) {
        return new ControlGroupRef({
            sectionId: section.id,
            sectionName: section.accno || section.typeName,
            isRoot: isRoot
        });
    }

    private constructor(params: Partial<ControlGroupRef> = {}) {
       this.sectionId = params.sectionId || 'unknown_section_id';
       this.sectionName = params.sectionName || 'unknown_section_name';
       this.featureName = params.featureName;
       this.icon = params.icon || 'fa-square';
       this.isRoot = params.isRoot === true;
    }

    get name(): string {
        return this.featureName || this.sectionName;
    }

    fieldRef(field: Field): ControlRef {
        return this.createRef(field.id, field.name, field.type.icon);
    }

    columnRef(column: Attribute): ControlRef {
        return this.createRef(column.id, 'Column');
    }

    rowValueRef(column: Attribute, rowId: string): ControlRef {
        return this.createRef(column.id + '#' + rowId, column.name);
    }

    featureRef(feature: Feature): ControlGroupRef {
        return new ControlGroupRef({
            sectionId: this.sectionId,
            sectionName: this.sectionName,
            featureName: feature.typeName,
            icon: feature.type.icon,
            isRoot: this.isRoot
        });
    }

    private createRef(id: string, name: string, icon?: string) {
        const parentName = this.featureName || this.sectionName;
        const uniqueId = [parentName, id].join('_');
        return new ControlRef(uniqueId, name, this, icon || this.icon);
    }
}

export class MyFormControl extends FormControl {
    ref: ControlRef = ControlRef.unknown;

    static compareBySectionId = (c1: FormControl, c2: FormControl) => {
        if (c1 instanceof MyFormControl && c2 instanceof MyFormControl) {
            return c1.ref.sectionId.localeCompare(c2.ref.sectionId);
        } else if (c1 instanceof MyFormControl) {
            return 1;
        } else if (c2 instanceof MyFormControl) {
            return -1;
        }
        return 0;
    }

    constructor(formState?: any,
                validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
                asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null) {
        super(formState, validatorOrOpts, asyncValidator);
    }

    withRef(ref: ControlRef): MyFormControl {
        this.ref = ref;
        return this;
    }
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
                errors['uniqueCols'] = {value: control.value};
            } else if (errors !== null) {
                delete errors['uniqueCols'];
                if (Object.keys(errors).length === 0) {
                    errors = null;
                }
            }
            control.setErrors(errors);
        });
        return {'uniqueCols': {value: duplicates[0]}};
    }

    static formatDate: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
        const v = control.value;
        return String.isNotDefinedOrEmpty(v) || (parseDate(v) !== undefined) ? null : {'format': {value: v}};
    }

    static formatOrcid: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
        const v = control.value;
        return String.isNotDefinedOrEmpty(v) || /^\d{4}-\d{4}-\d{4}-\d{4}$/.test(v) ? null : {'format': {value: v}};
    }
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

        if (column.uniqueValues) {
            validators.push(RxwebValidators.unique());
        }

        return [
            ...validators,
            ...SubmFormValidators.forValueType(column.valueType)
        ];
    }

    static forColumn(_column: Attribute): ValidatorFn[] {
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
            'required': () => {
                return `Please enter the ${ref.parentName}'s ${ref.name.toLowerCase()}`;
            },
            'minlength': (error: { requiredLength: number, actualLength: number }) => {
                return `Please use at least ${error.requiredLength} characters`;
            },
            'maxlength': (error: { requiredLength: number, actualLength: number }) => {
                return `Please use up to ${error.requiredLength} characters`;
            },
            'format': () => {
                return `Please provide a valid value`;
            },
            'pattern': (error: { actualValue: string, requiredPattern: string }) => {
                return `Please provide a value in '${error.requiredPattern}' format`;
            },
            'uniqueCols': (error: { value: string }) => {
                return `${ref.parentName}'s ${error.value} column is not unique`;
            },
            'unique': () => {
                return `${ref.parentName}'s values should be unique`;
            }
        };
    }
}

export class ErrorMessages {
    static map(control: AbstractControl): string[] {
        const errors = control.errors || {};
        const messages = CustomErrorMessages.for(control);

        return Object.keys(errors).map(errorKey => messages[errorKey](errors[errorKey]));
    }
}
