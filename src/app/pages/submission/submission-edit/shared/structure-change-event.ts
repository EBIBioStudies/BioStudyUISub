export class StructureChangeEvent {
  static featureAdd: StructureChangeEvent = new StructureChangeEvent('featureAdd');
  static featureColumnAdd: StructureChangeEvent = new StructureChangeEvent('featureColumnAdd');
  static featureColumnRemove: StructureChangeEvent = new StructureChangeEvent('featureColumnRemove');
  static featureRemove: StructureChangeEvent = new StructureChangeEvent('featureRemove');
  static featureRowAdd: StructureChangeEvent = new StructureChangeEvent('featureRowAdd');
  static featureRowOrderUpdate: StructureChangeEvent = new StructureChangeEvent('featureRowOrderUpdate');
  static featureRowRemove: StructureChangeEvent = new StructureChangeEvent('featureRowRemove');
  static init: StructureChangeEvent = new StructureChangeEvent('init');
  static sectionAdd: StructureChangeEvent = new StructureChangeEvent('sectionAdd');
  static sectionRemove: StructureChangeEvent = new StructureChangeEvent('sectionRemove');

  constructor(readonly name: string) {}
}
