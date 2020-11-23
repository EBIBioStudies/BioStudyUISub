import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PubMedIdSearchComponent } from './pubmedid-search.component';
import { PubMedSearchService } from './pubmedid-search.service';

@NgModule({
  imports: [CommonModule, FormsModule, HttpClientModule],
  providers: [PubMedSearchService],
  declarations: [PubMedIdSearchComponent],
  exports: [PubMedIdSearchComponent]
})
export class PubMedIdSearchModule {}
