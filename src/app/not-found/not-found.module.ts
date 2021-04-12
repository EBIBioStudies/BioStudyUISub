import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NotFoundComponent } from './not-found.component';

@NgModule({
  imports: [RouterModule],
  declarations: [NotFoundComponent],
  exports: [NotFoundComponent]
})
export class NotFoundModule {}
