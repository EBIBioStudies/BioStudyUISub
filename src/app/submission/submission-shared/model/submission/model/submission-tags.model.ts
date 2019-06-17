import { Tag } from '../../model.common';
import { TaggedData } from './submission';

class Tags {
  private _tags: Tag[];
  private _accessTags: string[];

  static create(data?: TaggedData): Tags {
      if (data !== undefined) {
          return new Tags(data.tags, data.accessTags);
      }
      return new Tags();
  }

  constructor(tags: Tag[] = [], accessTags: string[] = []) {
      this._tags = tags.slice();
      this._accessTags = accessTags.slice();
  }

  get tags(): any[] {
      return this._tags.map(t => Object.assign({}, t));
  }

  get accessTags(): string[] {
      return this._accessTags.slice();
  }
}

export default Tags;
