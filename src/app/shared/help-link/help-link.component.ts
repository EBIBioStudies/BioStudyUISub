import { Component, Input } from '@angular/core';

@Component({
  selector: 'st-help-link',
  templateUrl: './help-link.component.html'
})
export class HelpLinkComponent {
  @Input() text: string = '';
  @Input() href: string = '';

  get isLinkValid(): boolean {
    return this.href.length > 0;
  }
}
