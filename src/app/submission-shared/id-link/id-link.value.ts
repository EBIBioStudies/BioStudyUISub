export class IdLinkValue {
  private value;

  constructor(value: { prefix?: string, id?: string, url?: string }) {
    this.value = value;
  }

  get prefix(): string {
    return this.value.prefix;
  }

  get id(): string {
    return this.value.id;
  }

  get url(): string {
    return this.value.url;
  }

  asString(): string {
    if (this.value.url === undefined) {
      return `${this.value.prefix || ''}:${this.value.id || ''}`;
    }
    return this.value.url;
  }
}
