import { Pipe, PipeTransform } from '@angular/core';

/* E.g. 'ReleaseDate' => 'Release date' */
@Pipe({name: 'camelcase2label'})
export class Camelcase2LabelPipe implements PipeTransform {
    transform(value: any, ...args: any[]): any {
        if (!value || typeof value !== 'string') {
            return value;
        }

        const words = value.trim().replace(/([a-z])([A-Z])/g, '$1 $2');
        return words[0].toUpperCase() + words.substr(1).toLowerCase();
    }
}
