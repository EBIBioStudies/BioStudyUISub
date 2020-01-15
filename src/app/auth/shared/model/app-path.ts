export class AppPath {
  private path: string;

  constructor(anchor: string) {
    this.path = anchor;
  }

  get value(): string {
    return this.path;
  }
}
