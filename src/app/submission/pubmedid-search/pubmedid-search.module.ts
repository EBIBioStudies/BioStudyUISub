import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { PubMedIdSearchComponent } from './pubmedid-search.component';
import { PubMedIdSearchModalComponent } from './pubmedid-search-modal.component';
import { PubMedSearchService } from './pubmedid-search.service';

@NgModule({
  imports: [CommonModule, FormsModule, HttpClientModule, BsDropdownModule],
  providers: [PubMedSearchService],
  declarations: [PubMedIdSearchComponent, PubMedIdSearchModalComponent],
  exports: [PubMedIdSearchComponent]
})
export class PubMedIdSearchModule {}
