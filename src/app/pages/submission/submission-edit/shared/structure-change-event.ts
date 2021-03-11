export class StructureChangeEvent {
  static tableAdd: StructureChangeEvent = new StructureChangeEvent('tableAdd');
  static tableColumnAdd: StructureChangeEvent = new StructureChangeEvent('tableColumnAdd');
  static tableColumnRemove: StructureChangeEvent = new StructureChangeEvent('tableColumnRemove');
  static tableRemove: StructureChangeEvent = new StructureChangeEvent('tableRemove');
  static tableRowAdd: StructureChangeEvent = new StructureChangeEvent('tableRowAdd');
  static tableRowOrderUpdate: StructureChangeEvent = new StructureChangeEvent('tableRowOrderUpdate');
  static tableRowRemove: StructureChangeEvent = new StructureChangeEvent('tableRowRemove');
  static init: StructureChangeEvent = new StructureChangeEvent('init');
  static sectionAdd: StructureChangeEvent = new StructureChangeEvent('sectionAdd');
  static sectionRemove: StructureChangeEvent = new StructureChangeEvent('sectionRemove');

  constructor(readonly name: string) {}
}
