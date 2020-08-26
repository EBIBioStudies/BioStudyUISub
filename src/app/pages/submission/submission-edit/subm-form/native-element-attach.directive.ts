import { NgControl } from '@angular/forms';
import { AfterViewInit, Directive, ElementRef, OnDestroy } from '@angular/core';

@Directive({
  selector: '[stNativeElementAttach]'
})
export class NativeElementAttachDirective implements AfterViewInit, OnDestroy {
  constructor(private el: ElementRef, private ngControl: NgControl) {
  }

  ngAfterViewInit(): void {
    setTimeout(this.update);
  }

  ngOnDestroy() {
    (this.ngControl.control as any).nativeElement = undefined;
  }

  private update = () => {
    if (this.ngControl && this.ngControl.control) {
      const ctrl = this.ngControl.control as any;
      ctrl.nativeElement = this.el.nativeElement;
    }
  }
}
