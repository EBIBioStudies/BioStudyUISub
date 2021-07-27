import { Component, Input } from '@angular/core';

@Component({
  selector: 'st-activation-link-success',
  templateUrl: './activation-link-success.component.html'
})
export class ActivationLinkSuccessComponent {
  @Input() email: string = '';
  @Input() comesFromEmail: boolean = false;
  activationCode: string = '';

  get isActivationCodeEmpty(): boolean {
    return this.activationCode.length === 0;
  }
}
