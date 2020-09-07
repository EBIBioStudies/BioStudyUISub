import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, HostListener } from '@angular/core';

@Component({
  selector: 'st-file-tree-dropdown',
  templateUrl: './file-tree-dropdown.component.html',
  styleUrls: ['./file-tree-dropdown.component.css']
})
export class FileTreeDropdownComponent implements OnInit, OnDestroy {
  @Output() fileTreeDropdownClose = new EventEmitter();
  @ViewChild('dropdown', { read: ElementRef, static: true }) ddRef?: ElementRef;
  @Output() fileSelect = new EventEmitter();
  @Input() isOpen = false;
  @Input() targetElement: any;

  private fileTreeDropdownStyle: any;

  constructor(private elementRef: ElementRef) {}

  get isVisible(): boolean {
    return this.isInBodyContainer() || this.isOpen;
  }

  get style(): any {
    if (this.fileTreeDropdownStyle === undefined) {
      this.fileTreeDropdownStyle = this.computeStyle();
    }
    return this.fileTreeDropdownStyle;
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

  onFileSelect(value: string): void {
    this.fileSelect.emit(value);
    this.fileTreeDropdownClose.emit();
  }

  @HostListener('document:click', ['$event.target'])
  onOutsideClick(target: Element): void {
    if (!this.isVisible || this.ddRef === undefined) {
      return;
    }

    if (!this.ddRef.nativeElement.contains(target)) {
      this.fileTreeDropdownClose.emit();
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
