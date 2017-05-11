import {Items} from '../model/submission';

import * as _ from 'lodash';

export class TypeaheadValuesForItem {
    constructor(private __typeahead: TypeaheadValues, private __itemIdx: number) {
    }

    typeaheadValues(attrName: string): string[] {
        return this.__typeahead.typeaheadValues(attrName, this.__itemIdx);
    }
}

export class TypeaheadValues {
    constructor(private __attrNames: string[],
                private __items: Items) {
    }

    forItem(itemIdx: number): TypeaheadValuesForItem {
        return new TypeaheadValuesForItem(this, itemIdx);
    }

    typeaheadValues(attrName: string, itemIdx: number): string[] {
        let attr = _.find(this.__attrNames, a => a === attrName);
        if (!attr) {
            return [];
        }
        let items = _.without(this.__items.items, this.__items.items[itemIdx]);
        let res =
            _.uniq(
                _.map(
                    _.reject(
                        _.map(
                            _.map(items, (item) => item.attributes.attributes), (attrs) => {
                                return _.find(attrs, {name: attrName})
                            }), v => _.isUndefined(v)
                    ), 'value')
            );
        return res;
    }
}