import {Directive, ElementRef, HostListener, Input, AfterContentInit, AfterContentChecked} from '@angular/core';

import {fromEvent} from 'rxjs';

interface CSSStyleDeclarationWithResize extends CSSStyleDeclaration {
    resize: string
}

@Directive({
    selector: 'textarea[autosize]'
})
export class TextareaAutosizeDirective implements AfterContentInit, AfterContentChecked {
    @Input('autosize') private maxHeight: number = 100;
    private minHeight: number = 50;

    constructor(private element: ElementRef) {
    }

    ngAfterContentInit(): void {
        let el = this.element.nativeElement;
        const style: CSSStyleDeclarationWithResize = el.style as CSSStyleDeclarationWithResize;
        style.overflowY = 'hidden';
        style.resize = 'none';
        style.maxHeight = `${this.maxHeight}px`;

        fromEvent(window, 'resize')
            .debounceTime(250)
            .distinctUntilChanged((evt: any) => evt.timeStamp)
            .subscribe(() => this.adjust());
    }

    ngAfterContentChecked(): void {
        this.adjust();
    }

    @HostListener('input') onInput(): void {
        this.adjust();
    }

    private adjust(): void {
        let el = this.element.nativeElement;

        el.style.height = 'auto';
        el.style.height = (el.scrollHeight < this.minHeight ? this.minHeight : el.scrollHeight) + 'px';

        if (el.scrollHeight > this.maxHeight) {
            el.style.overflowY = 'scroll';
        } else {
            el.style.overflowY = 'hidden';
        }
    }
}