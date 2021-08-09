import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'st-activation-link-success',
  templateUrl: './activation-link-success.component.html'
})
export class ActivationLinkSuccessComponent implements AfterViewInit {
  @Input() email: string = '';
  @Input() comesFromEmail: boolean = false;
  activationCode: string = '';

  @ViewChild('activationCodeRef', { static: false })
  private activationCodeRef!: ElementRef;

  ngAfterViewInit(): void {
    this.activationCodeRef.nativeElement.focus();
  }

  get isActivationCodeEmpty(): boolean {
    return this.activationCode.length === 0;
  }
}
