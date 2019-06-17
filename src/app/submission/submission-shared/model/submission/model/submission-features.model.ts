import { SectionType, FeatureType } from '../../templates';
import { FeatureData } from './submission';
import Feature from './submission-feature.model';

class Features {
  private features: Feature[] = [];

  constructor(type: SectionType, features: Array<FeatureData> = []) {
      const fd = features.filter(f => String.isDefinedAndNotEmpty(f.type))
          .reduce((rv, d) => {
              rv[d.type!] = d;
              return rv;
          }, {});

      type.featureTypes.forEach(ft => {
          this.add(ft, fd[ft.name]);
          fd[ft.name] = undefined;
      });

      Object.keys(fd).forEach(key => {
          if (fd[key] !== undefined) {
              const ft = type.getFeatureType(key);
              this.add(ft, fd[ft.name]);
          }
      });

      type.featureGroups.forEach(group => {
          const featureGroup = this.features.filter(f => group.includes(f.typeName));
          featureGroup.forEach(f => f.groups.push(featureGroup));
          const rowCount = featureGroup.map(f => f.rowSize()).reduce((rv, v) => rv + v, 0);
          if (rowCount === 0) {
              featureGroup[0].addRow();
          }
      });
  }

  get length(): number {
      return this.features.length;
  }

  list(): Feature[] {
      return this.features.slice();
  }

  add(type: FeatureType, data?: FeatureData): Feature | undefined {
      if (this.features.filter(f => f.type === type).length > 0) {
          console.error(`Feature of type ${type} already exists in the section`);
          return;
      }
      const feature = new Feature(type, data);
      this.features.push(feature);
      return feature;
  }

  removeById(featureId: string): boolean {
      const feature = this.features.find(f => f.id === featureId);
      return feature !== undefined && this.remove(feature);
  }

  remove(feature: Feature): boolean {
      if (feature.type.tmplBased) {
          return false;
      }
      const index = this.features.indexOf(feature);
      if (index < 0) {
          return false;
      }
      this.features.splice(index, 1);

      feature.type.destroy();
      return true;
  }

  /**
   * Retrieves the feature object that fulfills a scalar comparison with one of its property values.
   * By default, it will look for a given ID.
   * @param {string} value - Value of the required feature's property.
   * @param {string} [property = 'id'] - Property name by which features are looked up.
   * @returns {Feature} Feature fulfilling the predicated comparison.
   */
  find(value: string, property: string = 'id'): Feature | undefined {
      return this.features.find((feature) => (feature[property] === value));
  }
}

export default Features;
