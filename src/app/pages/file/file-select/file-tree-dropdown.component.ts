import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, HostListener } from '@angular/core';

@Component({
  selector: 'st-file-tree-dropdown',
  templateUrl: './file-tree-dropdown.component.html',
  styleUrls: ['./file-tree-dropdown.component.css']
})
export class FileTreeDropdownComponent implements OnInit, OnDestroy {
  @Output() close = new EventEmitter();
  @ViewChild('dropdown', { read: ElementRef, static: true }) ddRef?: ElementRef;
  @Output() fileSelect = new EventEmitter();
  @Input() isOpen = false;
  @Input() targetElement: any;

  private _style: any;

  constructor(private elementRef: ElementRef) {}

  get isVisible(): boolean {
    return this.isInBodyContainer() || this.isOpen;
  }

  get style(): any {
    if (this._style === undefined) {
      this._style = this.computeStyle();
    }
    return this._style;
  }

  ngOnDestroy(): void {
    if (this.isInBodyContainer() && document.body.contains(this.elementRef.nativeElement)) {
      document.body.removeChild(this.elementRef.nativeElement);
    }
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

  @HostListener('document:click', ['$event.target'])
  onOutsideClick(target: Element): void {
    if (!this.isVisible || this.ddRef === undefined) {
      return;
    }

    if (!this.ddRef.nativeElement.contains(target)) {
      this.close.emit();
    }
  }

  private computePosition(nativeElement): { left: string, top: string } {
    const rect = nativeElement.getBoundingClientRect();
    const dropdownWidth = 300; // This should correspond to the width in the file tree style.

    return {
      top: (rect.top + window.scrollY) + 'px',
      left: (rect.left + window.scrollX + dropdownWidth) + 'px'
    };
  }

  private computeStyle(): any {
    if (this.isInBodyContainer()) {
      const pos = this.computePosition(this.targetElement);

      return {
        position: 'absolute',
        top: pos.top,
        left: pos.left
      };
    }
    return {};
  }

  private isInBodyContainer(): boolean {
    return this.targetElement !== undefined;
  }
}
