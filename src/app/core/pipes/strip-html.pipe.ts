import { Pipe, PipeTransform } from '@angular/core';

/**
 * Custom Angular pipe for stripping a given string of all HTML tags.
 *
 * @author Hector Casanova <hector@ebi.ac.uk>
 */
@Pipe({
  name: 'stripHtml'
})
export class StripHtmlPipe implements PipeTransform {
  transform(value: string): string {
    return value.replace(/<\/?[^>]+>/gi, '');
  }
}
