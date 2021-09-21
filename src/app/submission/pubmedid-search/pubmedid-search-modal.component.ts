import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { PubMedPublication } from './pubmedid-search.service';

@Component({
  selector: 'st-pubmedid-search-modal',
  templateUrl: './pubmedid-search-modal.component.html'
})
export class PubMedIdSearchModalComponent implements AfterViewInit {
  @Input() publications: PubMedPublication[] = [];
  @Input() value: string = '';
  @Input() isBusy: boolean = false;

  @ViewChild('searchPubmedidInput', { static: true })
  private searchPubmedidInput!: ElementRef;

  @Input() onPubMedIdChange: (value: string) => void = () => {};
  @Input() onSelectPub: (publication: PubMedPublication) => void = () => {};

  constructor(public bsModalRef: BsModalRef) {}

  get hasPublications(): boolean {
    return this.publications.length > 0;
  }

  get isValueEmpty(): boolean {
    return this.value.length === 0;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.searchPubmedidInput.nativeElement.focus();
    });
  }

  hide(): void {
    this.bsModalRef.hide();
  }

  onCancelCloseClick(): void {
    this.hide();
  }

  selectPub(publication: PubMedPublication): void {
    this.onSelectPub(publication);
  }
}
