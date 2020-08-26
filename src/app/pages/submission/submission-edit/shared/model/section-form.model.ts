import {
  DisplayType,
  Feature,
  FeatureType,
  Field,
  Section,
  SectionType
} from 'app/pages/submission/submission-shared/model';
import { FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { FormBase } from '../model/form-base.model';
import { ControlGroupRef } from '../control-reference';
import { FieldControl } from './field-control.model';
import { FeatureForm } from './feature-form.model';
import { StructureChangeEvent } from '../structure-change-event';

export class SectionForm extends FormBase {
  readonly featureForms: FeatureForm[] = [];
  readonly fieldControls: FieldControl[] = [];
  readonly sectionPath: string[];
  /** Can use form's valueChanges, but then the operations like add/remove column will not be atomic,
  as it requires to apply multiple changes at once */
  readonly structureChanges$ = new BehaviorSubject<StructureChangeEvent>(StructureChangeEvent.init);
  readonly subsectionForms: SectionForm[] = [];

  private sb: Map<string, Subscription> = new Map<string, Subscription>();
  private sectionRef: ControlGroupRef;

  constructor(private section: Section, readonly parent?: SectionForm) {
    super(new FormGroup({
      fields: new FormGroup({}),
      features: new FormGroup({}),
      sections: new FormGroup({})
    }));

    this.sectionPath = this.isRootSection ? [] : [...this.parent!.sectionPath, ...[this.id]];
    this.sectionRef = ControlGroupRef.sectionRef(section, this.isRootSection);

    this.buildElements();
  }

  addFeature(type: FeatureType): Feature | undefined {
    const feature = this.section.features.add(type);
    if (feature) {
      this.addFeatureForm(feature);
      this.structureChanges$.next(StructureChangeEvent.featureAdd);
    }
    return feature;
  }

  addFeatureEntry(featureId: string): void {
    const featureForm = this.featureForms.find(f => f.id === featureId);
    if (featureForm !== undefined) {
      featureForm.addEntry();
    }
  }

  addSection(type: SectionType): SectionForm {
    const form = this.addSubsectionForm(this.section.sections.add(type));
    this.structureChanges$.next(StructureChangeEvent.sectionAdd);
    return form;
  }

  findFieldControl(fieldName: string) {
    return this.fieldControls.find((fieldControl) => fieldControl.name === fieldName);
  }

  findSectionForm(sectionId: string) {
    return this.findRoot().lookupSectionForm(sectionId);
  }

  getFeatureControl(featureId: string): FormControl | undefined {
    const featureForm = this.featureForms.find(f => f.id === featureId);
    if (featureForm !== undefined) {
      return featureForm.scrollToTheLastControl;
    }
  }

  getFeatureFormById(featureId: string): FeatureForm | undefined {
    return this.featureForms.find((feature) => feature.id === featureId);
  }

  isSectionRemovable(sectionForm: SectionForm): boolean {
    const min = sectionForm.typeMinRequired;
    return sectionForm.isTypeRemovable || (this.section.sections.byType(sectionForm.typeName).length > min);
  }

  removeFeatureType(featureId: string): void {
    const index = this.featureForms.findIndex(f => f.id === featureId);
    if (index < 0) {
      return;
    }

    if (this.section.features.removeById(featureId)) {
      this.unsubscribe(featureId);
      this.featureForms.splice(index, 1);
      this.featureFormGroups.removeControl(featureId);
      this.structureChanges$.next(StructureChangeEvent.featureRemove);
    }
  }

  removeSection(sectionId: string): void {
    const index = this.subsectionForms.findIndex(s => s.id === sectionId);
    if (index < 0) {
      return;
    }

    if (this.section.sections.removeById(sectionId)) {
      this.subsectionForms.splice(index, 1);
      this.subsectionFormGroups.removeControl(sectionId);
      this.structureChanges$.next(StructureChangeEvent.sectionRemove);
    }
  }

  get type(): SectionType {
    return this.section.type;
  }

  get isTypeReadonly(): boolean {
    return this.section.type.displayType === DisplayType.READONLY;
  }

  get typeName(): string {
    return this.section.typeName;
  }

  get id(): string {
    return this.section.id;
  }

  get accno(): string {
    return this.section.accno;
  }

  get isTypeRemovable(): boolean {
    return this.section.type.displayType.isRemovable;
  }

  get typeMinRequired(): number {
    return this.section.type.minRequired;
  }

  get isRootSection(): boolean {
    return this.parent === undefined;
  }

  get sectionTypes(): Array<SectionType> {
    return [...this.section.type.sectionTypes, ...this.subsectionForms.map(sf => sf.type)]
      .reduce((rv, v) => {
        if (rv[0][v.name] === undefined) {
          rv[0][v.name] = 1;
          rv[1].push(v);
        }
        return rv;
      }, [{} as { [key: string]: any }, [] as Array<SectionType>])[1] as SectionType[];
  }

  private get fieldFormGroup(): FormGroup {
    return this.form.get('fields') as FormGroup;
  }

  private get featureFormGroups(): FormGroup {
    return this.form.get('features') as FormGroup;
  }

  private get subsectionFormGroups(): FormGroup {
    return this.form.get('sections') as FormGroup;
  }

  private addFeatureForm(feature: Feature): FeatureForm {
    const featureForm = new FeatureForm(feature, this.sectionRef.featureRef(feature));
    this.featureForms.push(featureForm);
    this.featureFormGroups.addControl(feature.id, featureForm.form);
    this.subscribe(featureForm);
    return featureForm;
  }

  private addFieldControl(field: Field): void {
    const fieldControl = new FieldControl(field, this.sectionRef.fieldRef(field));
    this.fieldControls.push(fieldControl);
    this.fieldFormGroup.addControl(field.id, fieldControl.control);
  }

  private addSubsectionForm(section: Section): SectionForm {
    const sectionForm = new SectionForm(section, this);
    this.subsectionForms.push(sectionForm);
    this.subsectionFormGroups.addControl(section.id, sectionForm.form);
    return sectionForm;
  }

  private buildElements() {
    const section = this.section;

    section.fields.list().forEach((field) => this.addFieldControl(field));

    [section.annotations, ...section.features.list()]
      .forEach((feature) => this.addFeatureForm(feature));

    section.sections.list().forEach((sectionItem) => this.addSubsectionForm(sectionItem));
  }

  private findRoot(): SectionForm {
    if (this.parent === undefined) {
      return this;
    }
    return this.parent.findRoot();
  }

  private lookupSectionForm(sectionId: string): SectionForm | undefined {
    if (this.section.id === sectionId) {
      return this;
    }
    return this.subsectionForms.find(sf => sf.lookupSectionForm(sectionId) !== undefined);
  }

  private subscribe(featureForm: FeatureForm) {
    this.sb.set(featureForm.id, featureForm.structureChanges$.subscribe((event) => {
      this.form.markAsTouched();

      this.structureChanges$.next(event);
    }));
  }

  private unsubscribe(featureId: string) {
    this.sb.get(featureId)!.unsubscribe();
    this.sb.delete(featureId);
  }
}
