import {NgControl} from '@angular/forms';
import {Directive, ElementRef, Input, OnChanges} from '@angular/core';

@Directive({
    selector: '[submControlName]'
})
export class SubmControlDirective implements OnChanges {
    @Input('submControlName') controlName?: string;
    @Input('submControlIcon') controlIcon?: string;

    constructor(private el: ElementRef, private ngControl: NgControl) {
    }

    ngOnChanges() {
        setTimeout(this.update);
    }

    private update = () => {
        if (this.ngControl && this.ngControl.control) {
            const ctrl = <any>this.ngControl.control;
            ctrl.nativeElement = this.el.nativeElement;
            ctrl.controlName = this.controlName || '<Control Name>';
            ctrl.controlIcon = this.controlIcon || '';
        }
    }
}