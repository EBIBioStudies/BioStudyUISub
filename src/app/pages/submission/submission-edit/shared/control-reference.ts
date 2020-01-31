import { Attribute, Feature, Field, Section } from 'app/pages/submission/submission-shared/model';

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

  readonly featureName?: string;
  readonly icon: string;
  readonly isRoot: boolean;
  readonly sectionId: string;
  readonly sectionName: string;

  private constructor(params: Partial<ControlGroupRef> = {}) {
    this.sectionId = params.sectionId || 'unknown_section_id';
    this.sectionName = params.sectionName || 'unknown_section_name';
    this.featureName = params.featureName;
    this.icon = params.icon || 'fa-square';
    this.isRoot = params.isRoot === true;
  }

  static sectionRef(section: Section, isRoot: boolean = false) {
    return new ControlGroupRef({
      sectionId: section.id,
      sectionName: section.accno || section.typeName,
      isRoot: isRoot
    });
  }

  get name(): string {
    return this.featureName || this.sectionName;
  }

  columnRef(column: Attribute): ControlRef {
    return this.createRef(column.id, 'Column');
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

  fieldRef(field: Field): ControlRef {
    return this.createRef(field.id, field.name, field.type.icon);
  }

  rowValueRef(column: Attribute, rowId: string): ControlRef {
    return this.createRef(column.id + '#' + rowId, column.name);
  }

  private createRef(id: string, name: string, icon?: string) {
    const parentName = this.featureName || this.sectionName;
    const uniqueId = [parentName, id].join('_');
    return new ControlRef(uniqueId, name, this, icon || this.icon);
  }
}
