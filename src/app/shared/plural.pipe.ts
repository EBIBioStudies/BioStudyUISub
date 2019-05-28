import { Pipe, PipeTransform } from '@angular/core';
import * as pluralize from 'pluralize';

@Pipe({
    name: 'plural'
})
export class PluralPipe implements PipeTransform {
    transform(value: number, word: string): string {
        return pluralize(word, value, true);
    }
}
