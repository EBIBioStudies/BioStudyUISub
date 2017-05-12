import {
    Pipe,
    Injectable,
    PipeTransform
} from '@angular/core';

import * as _ from 'lodash';

@Pipe({
    name: 'propFilter'
})
@Injectable()
export class PropertyFilterPipe implements PipeTransform {
    transform(items: Array<any>, tmpl: any): Array<any> {
        let keys = _.keysIn(tmpl);
        let res = _.filter(items, item => {
            for (let k of keys) {
                if (item[k] !== tmpl[k])
                    return false;
            }
            return true;
        });
        return res;
    }
}
