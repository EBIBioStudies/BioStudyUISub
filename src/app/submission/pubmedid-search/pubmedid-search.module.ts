import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PubMedIdSearchComponent } from './pubmedid-search.component';
import { PubMedSearchService } from './pubmedid-search.service';

@NgModule({
  imports: [CommonModule, FormsModule, HttpClientModule, BsDropdownModule],
  providers: [PubMedSearchService],
  declarations: [PubMedIdSearchComponent],
  exports: [PubMedIdSearchComponent]
})
export class PubMedIdSearchModule {}
