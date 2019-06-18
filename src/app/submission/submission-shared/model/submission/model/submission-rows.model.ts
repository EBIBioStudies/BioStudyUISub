import ValueMap from '../common/value-map';

class Rows {
  private rows: Array<ValueMap> = [];

  constructor(private capacity: number = -1) {
  }

  list(): Array<ValueMap> {
      return this.rows.slice();
  }

  at(index: number): ValueMap | undefined {
      return (index >= 0) && (index < this.rows.length) ? this.rows[index] : undefined;
  }

  add(keys: string[]): ValueMap {
      if (this.isFull()) {
          throw new Error(`Can not add more than ${this.capacity} row(s) to a feature`);
      }
      const row = new ValueMap(keys);
      this.rows.push(row);
      return row;
  }

  removeAt(index: number): boolean {
      if ((index < 0) || (index > this.rows.length)) {
          return false;
      }
      this.rows.splice(index, 1);
      return true;
  }

  addKey(key: string) {
      this.rows.forEach(r => {
          r.add(key);
      });
  }

  removeKey(key: string) {
      this.rows.forEach(r => {
          r.remove(key);
      });
  }

  size(): number {
      return this.rows.length;
  }

  private isFull(): boolean {
      return this.capacity > 0 && this.rows.length === this.capacity;
  }
}

export default Rows;
