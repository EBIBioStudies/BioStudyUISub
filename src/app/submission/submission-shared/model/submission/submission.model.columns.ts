import { Attribute } from './submission.model.attribute';
import { ColumnType } from '../templates';

export class Columns {
  private columns: Attribute[] = [];

  list(): Attribute[] {
    return this.columns.slice();
  }

  add(column: Attribute): void {
    this.columns.push(column);
  }

  remove(id: string): boolean {
    return this.removeAt(this.columns.findIndex(attr => attr.id === id));
  }

  removeAt(index: number): boolean {
    if (index >= 0) {
      this.columns.splice(index, 1);
      return true;
    }
    return false;
  }

  at(index: number): Attribute | undefined {
    return (index >= 0) && (index < this.columns.length) ? this.columns[index] : undefined;
  }

  findById(id: string): Attribute | undefined {
    return this.columns.find(col => col.id === id);
  }

  findByType(colType: ColumnType): Attribute | undefined {
    return this.columns.find(col => col.name === colType.name && col.valueType === colType.valueType && col.isTemplateBased);
  }

  filterByName(name: string): Attribute[] {
    return this.columns.filter(attr => attr.name.isEqualIgnoringCase(name));
  }

  keys(): string[] {
    return this.columns.map(attr => attr.id);
  }

  names(): any {
    return this.columns.map(attr => attr.name);
  }

  size(): number {
    return this.columns.length;
  }
}
