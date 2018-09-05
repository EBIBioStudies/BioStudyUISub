import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

@Component({
    selector: 'file-tree-dropdown',
    templateUrl: './file-tree-dropdown.component.html',
    styleUrls: ['./file-tree-dropdown.component.css'],
    host: {
        '(document:click)': 'onOutsideClick($event)',
    },
})
export class FileTreeDropdownComponent implements OnInit {
    @Input() isOpen = false;
    @Input() targetElement: any;
    @Output() fileSelect = new EventEmitter();
    @Output() close = new EventEmitter();

    @ViewChild('dropdown', {read: ElementRef}) ddRef?: ElementRef;

    private _style: any;

    constructor(private elementRef: ElementRef) {
    }

    get isVisible(): boolean {
        return this.isInBodyContainer() || this.isOpen;
    }

    get style(): any {
        if (this._style === undefined) {
            this._style = this.computeStyle();
        }
        return this._style;
    }

    private computeStyle(): any {
        if (this.isInBodyContainer()) {
            let pos = this.computePosition(this.targetElement);
            return {
                position: 'absolute',
                top: pos.top,
                left: pos.left
            }
        }
        return {};
    }

    private computePosition(nativeElement): { top: string, left: string } {
        let rect = nativeElement.getBoundingClientRect();
        return {
            top: (rect.bottom + window.scrollY) + 'px',
            left: (rect.right + window.scrollX) + 'px'
        }
    }

    private isInBodyContainer(): boolean {
        return this.targetElement !== undefined;
    }

    ngOnInit(): void {
        if (this.isInBodyContainer()) {
            document.body.appendChild(this.elementRef.nativeElement);
        }
    }

    onFileSelect(value: string) {
        this.fileSelect.emit(value);
        this.close.emit();
    }

    onOutsideClick(event: Event): void {
        if (!this.isVisible || this.ddRef === undefined) {
            return;
        }

        if (!this.ddRef.nativeElement.contains(event.target)) {
            this.close.emit();
        }
    }
}