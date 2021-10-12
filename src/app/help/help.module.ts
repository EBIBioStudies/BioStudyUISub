import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HelpModalComponent } from './help-modal.component';
import { HelpComponent } from './help.component';

@NgModule({
  imports: [RouterModule],
  declarations: [HelpComponent, HelpModalComponent],
  exports: [HelpComponent, HelpModalComponent]
})
export class HelpModule {}
