import {IdLinkValue} from './id-link.value';

export class IdLinkModel {
  private urlRegexp = /^(http|https|ftp)+[^\s]+$/;  //used to check if the link is a URL
  private idRegexp = /^([^:]*)(:.*)?$/;             //used to split link into valid tokens, not for validation

  private _prefix: string;
  private _id: string;
  private _url: string;

  update(input = '', prefixOnly = false): string {
    if (this.urlRegexp.test(input)) {
      this.updateValues({url: input});
      return input;
    }

    const m = input.match(this.idRegexp) || [input];
    const prefix = m[1];
    const id = m[2];
    this.updateValues({prefix: prefix, id: prefixOnly ? (this._id || ':') : id});

    return this.asString();
  }

  updateValues(values: { prefix?: string, id?: string, url?: string }) {
    this._prefix = values.prefix;
    this._id = values.id;
    this._url = values.url;
  }

  get prefix(): string {
    return this._prefix === undefined ? this._prefix : this._prefix.trim();
  }

  get id(): string {
    if (this._id !== undefined) {
      const v = this._id.trim().substring(1);
      return v.length === 0 ? undefined : v;
    }
    return undefined;
  }

  get url(): string {
    return this._url === undefined ? this._url : this._url.trim();
  }

  asValue(): IdLinkValue {
    return new IdLinkValue({prefix: this.prefix, id: this.id, url: this.url});
  }

  asString(): string {
    if (this._url === undefined) {
      return `${this._prefix || ''}${this._id || ''}`;
    }
    return this._url;
  }
}
