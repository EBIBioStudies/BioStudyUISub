import { AttributeNames } from '../../utils/constants';

/* Here are the attributes which we have to deal with exceptionally (unfortunately):
 * AttachTo:     It's updated/created when submission attached to a project; it can have multiple values (multiple projects).
 *               It's not visible to the user and could be changed only by the system. Always stays at the root level.
 * ReleaseDate:  It's moved to the Study section attributes (of the model) to be visible/editable by the user and then
 *               moved back to the submission level attributes when submit. The attribute name is unique.
 * Title:        Can be the submission level or on study level attribute. It's copied to the submission level when study is
 *               submitted.
 */
export class ExtAttrExceptions {
  private static allAttrs: Array<{
    name: string;
    rootLevel: boolean;
    studyLevel: boolean;
    systemOnly: boolean;
    unique: boolean;
  }> = [
    { name: AttributeNames.ATTACH_TO, rootLevel: true, studyLevel: false, systemOnly: true, unique: false },
    { name: AttributeNames.RELEASE_DATE, rootLevel: true, studyLevel: false, systemOnly: false, unique: true },
    { name: AttributeNames.TITLE, rootLevel: true, studyLevel: true, systemOnly: false, unique: true }
  ];

  private static editableAttr: Array<string> = ExtAttrExceptions.allAttrs
    .filter((at) => (at.rootLevel || at.studyLevel) && !at.systemOnly)
    .map((at) => at.name);

  private static editableAndRootOnlyAttr: Array<string> = ExtAttrExceptions.allAttrs
    .filter((at) => at.rootLevel && !at.studyLevel && !at.systemOnly)
    .map((at) => at.name);

  private static uniqueAttr: Array<string> = ExtAttrExceptions.allAttrs.filter((at) => at.unique).map((at) => at.name);

  static get editable(): string[] {
    return this.editableAttr;
  }

  static get editableAndRootOnly(): string[] {
    return this.editableAndRootOnlyAttr;
  }

  static get unique(): string[] {
    return this.uniqueAttr;
  }
}
