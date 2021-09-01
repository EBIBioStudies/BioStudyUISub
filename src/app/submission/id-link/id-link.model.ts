import { IdLinkValue } from './id-link.value';

export class IdLinkModel {
  private linkid?: string;
  private linkPrefix?: string;
  private linkUrl?: string;
  private idRegexp = /^([^:]*)(:.*)?$/; // used to split link into valid tokens, not for validation
  private urlRegexp = /^(http|https|ftp)+[^\s]+$/; // used to check if the link is a URL

  get prefix(): string | undefined {
    return this.linkPrefix === undefined ? this.linkPrefix : this.linkPrefix.trim();
  }

  get id(): string | undefined {
    if (this.linkid !== undefined) {
      const v = this.linkid.trim().substring(1);
      return v.length === 0 ? undefined : v;
    }
    return;
  }

  get url(): string | undefined {
    return this.linkUrl === undefined ? this.linkUrl : this.linkUrl.trim();
  }

  asString(): string {
    if (this.linkUrl === undefined) {
      return `${this.linkPrefix || ''}${this.linkid || ''}`;
    }
    return this.linkUrl;
  }

  asValue(): IdLinkValue {
    return new IdLinkValue({ prefix: this.prefix, id: this.id, url: this.url });
  }

  update(input = '', prefixOnly = false): string {
    if (this.urlRegexp.test(input)) {
      this.updateValues({ url: input });
      return input;
    }

    const m = input.match(this.idRegexp) || [input];
    const prefix = m[1];
    const id = m[2];
    this.updateValues({ prefix, id: prefixOnly ? this.linkid || ':' : id });

    return this.asString();
  }

  updateValues(values: { id?: string; prefix?: string; url?: string }): void {
    this.linkPrefix = values.prefix;
    this.linkid = values.id;
    this.linkUrl = values.url;
  }
}
