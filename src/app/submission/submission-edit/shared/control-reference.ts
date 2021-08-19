import { Attribute, Field, Section, Table } from 'app/submission/submission-shared/model';

// experimental: Control Reference details for using in error messages
export class ControlRef {
  static unknown = new ControlRef('unknown_control', 'unknown');

  constructor(
    readonly id: string,
    readonly name: string = '',
    readonly parentRef?: ControlGroupRef,
    readonly icon: string = 'fa-square',
    readonly title: string = ''
  ) {}

  get displayName(): string {
    return this.title || this.name;
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

// experimental: Controls Groups Reference (for sections and tables) for using in error list
export class ControlGroupRef {
  static unknown = new ControlGroupRef();

  readonly tableName?: string;
  readonly icon: string;
  readonly isRoot: boolean;
  readonly sectionId: string;
  readonly sectionName: string;

  private constructor(params: Partial<ControlGroupRef> = {}) {
    this.sectionId = params.sectionId || 'unknown_section_id';
    this.sectionName = params.sectionName || 'unknown_section_name';
    this.tableName = params.tableName;
    this.icon = params.icon || 'fa-square';
    this.isRoot = params.isRoot === true;
  }

  static sectionRef(section: Section, isRoot: boolean = false): ControlGroupRef {
    return new ControlGroupRef({
      sectionId: section.id,
      sectionName: section.accno || section.typeName,
      isRoot
    });
  }

  get name(): string {
    return this.tableName || this.sectionName;
  }

  columnRef(column: Attribute): ControlRef {
    return this.createRef(column.id, 'Column');
  }

  tableRef(table: Table): ControlGroupRef {
    return new ControlGroupRef({
      sectionId: this.sectionId,
      sectionName: this.sectionName,
      tableName: table.typeName,
      icon: table.type.icon,
      isRoot: this.isRoot
    });
  }

  fieldRef(field: Field): ControlRef {
    return this.createRef(field.id, field.name, field.type.icon, field.title);
  }

  rowValueRef(column: Attribute, rowId: string): ControlRef {
    return this.createRef(column.id + '#' + rowId, column.name);
  }

  private createRef(id: string, name: string, icon?: string, title?: string): ControlRef {
    const parentName = this.tableName || this.sectionName;
    const uniqueId = [parentName, id].join('_');
    return new ControlRef(uniqueId, name, this, icon || this.icon, title);
  }
}
