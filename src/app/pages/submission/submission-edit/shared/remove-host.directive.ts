import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[stRemoveHostTag]'
})
export class RemoveHostDirective implements OnInit {
  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    const nativeElement: HTMLElement = this.el.nativeElement;
    const parentElement: HTMLElement | null = nativeElement.parentElement;

    if (parentElement) {
      while (nativeElement.firstChild) {
        parentElement.insertBefore(nativeElement.firstChild, nativeElement);
      }

      parentElement.removeChild(nativeElement);
    }
  }
}
